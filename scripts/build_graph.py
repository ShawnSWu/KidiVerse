#!/usr/bin/env python3
"""
KidiVerse Knowledge Graph Builder
--------------------------------
Scans markdown notes, generates sentence embeddings via HuggingFace
SentenceTransformer, finds the top-k semantically closest notes for each file,
and writes a JSON knowledge graph that the Hugo front-end can visualise.

Outputs (relative to project root):
#   data/embeddings.npy            – NumPy array of shape (N, dim)
#   data/embeddings_index.json     – list[dict] with path & title matching rows
  static/data/notes_graph.json          – {nodes, edges, embeddingModel}

Typical usage:
    python scripts/build_graph.py --notes-dir content

Intended to run locally *or* inside GitHub Actions on every push / cron.
"""
from __future__ import annotations

import argparse
import json
import logging
import re
import sys
from pathlib import Path
from typing import Any, Dict, List

try:
    import numpy as np
    from sentence_transformers import SentenceTransformer
    from sklearn.neighbors import NearestNeighbors
except ImportError as exc:  # pragma: no cover
    logging.error("Missing dependency: %s – run `pip install -r requirements.txt`", exc)
    sys.exit(1)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Build semantic knowledge graph for KidiVerse")
    p.add_argument("--notes-dir", default="content", help="Directory containing markdown notes")
    p.add_argument("--output-json", default="static/data/notes_graph.json", help="Graph JSON output path")
    p.add_argument("--embedding-file", default="static/data/embeddings.npy", help="Embeddings .npy output")
    p.add_argument("--index-file", default="static/data/embeddings_index.json", help="Embeddings metadata index")
    p.add_argument("--model", default="sentence-transformers/all-MiniLM-L6-v2", help="SentenceTransformer model id")
    p.add_argument("--top-k", type=int, default=10, help="Nearest neighbours per note to keep")
    p.add_argument("--min-sim", type=float, default=0.25, help="Cosine similarity threshold for an edge")
    return p.parse_args()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def strip_front_matter(text: str) -> str:
    """Remove YAML front-matter delineated by '---'."""
    if text.lstrip().startswith("---"):
        parts = text.split("---", 2)
        if len(parts) == 3:
            return parts[2]
    return text


def extract_title(markdown_text: str, fallback: str) -> str:
    """Return first H1 heading (# Title) if present, else fallback filename."""
    m = re.search(r"^#\s+(.+)", markdown_text, flags=re.MULTILINE)
    return m.group(1).strip() if m else fallback


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    args = parse_args()
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    notes_root = Path(args.notes_dir)
    if not notes_root.exists():
        logging.error("Notes directory %s not found", notes_root)
        sys.exit(1)

    md_files = sorted(notes_root.rglob("*.md"))
    if not md_files:
        logging.warning("No markdown files under %s", notes_root)
        sys.exit(0)

    logging.info("%d markdown files detected", len(md_files))

    # Load ST model (cached on subsequent runs)
    logging.info("Loading SentenceTransformer model → %s", args.model)
    model = SentenceTransformer(args.model)

    # Read files & gather metadata
    texts: List[str] = []
    metadata: List[Dict[str, str]] = []
    for fp in md_files:
        body = strip_front_matter(fp.read_text(encoding="utf-8", errors="ignore")).strip()
        texts.append(body)
        # Determine group by top-level directory under notes_root, e.g. "content/kubernetes/..." -> "kubernetes"
        rel_parts = fp.relative_to(notes_root).parts
        group = rel_parts[0] if len(rel_parts) > 1 else notes_root.name
        metadata.append({
            "path": fp.as_posix(),
            "title": extract_title(body, fp.stem),
            "group": group,
        })

    # Encode to embeddings
    logging.info("Encoding documents…")
    embeddings = model.encode(texts, batch_size=32, show_progress_bar=True, normalize_embeddings=True).astype("float32")

    # Save embeddings + index for possible re-use/debug
    Path(args.embedding_file).parent.mkdir(parents=True, exist_ok=True)
    np.save(args.embedding_file, embeddings)
    with open(args.index_file, "w", encoding="utf-8") as f_index:
        json.dump(metadata, f_index, ensure_ascii=False, indent=2)
    logging.info("Embeddings saved → %s (shape %s)", args.embedding_file, embeddings.shape)

    # Compute nearest neighbours using cosine distance (1-similarity)
    nn = NearestNeighbors(n_neighbors=min(args.top_k + 1, len(embeddings)), metric="cosine")
    nn.fit(embeddings)
    distances, indices = nn.kneighbors(embeddings)

    # Build nodes & edges lists
    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, Any]] = []
    for i, meta in enumerate(metadata):
        nodes.append({"id": int(i), **meta})
        for dist, j in zip(distances[i][1:], indices[i][1:]):  # skip self index 0
            sim = 1.0 - dist
            if sim < args.min_sim or i >= j:
                continue  # only store undirected edge once
            edges.append({"source": int(i), "target": int(j), "score": round(float(sim), 4)})

    graph = {
        "nodes": nodes,
        "edges": edges,
        "embeddingModel": args.model,
    }
    Path(args.output_json).parent.mkdir(parents=True, exist_ok=True)
    with open(args.output_json, "w", encoding="utf-8") as f_graph:
        json.dump(graph, f_graph, ensure_ascii=False, indent=2)
    logging.info("Graph JSON written → %s (%d nodes, %d edges)", args.output_json, len(nodes), len(edges))


if __name__ == "__main__":
    main()
