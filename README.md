# KidiVerse – AI-Enhanced Hugo Note Theme

KidiVerse is a **Hugo static-site theme for Obsidian-style Markdown notebooks**.
It respects the typical Obsidian convention where **images live in an `attachments/` sub-folder** next to each note, and automatically resolves those links.
On top of a clean two-column dark layout, it ships with an **AI-powered semantic knowledge graph** that lets you explore relationships between notes visually.

---

## ✨ Features

* Two-column dark UI – collapsible sidebar auto-reads your `content/` tree
* Obsidian-style images – write `![alt](image.png)` and KidiVerse serves it automatically from `attachments/`
* AI semantic graph – SentenceTransformers + k-NN → interactive D3 force-directed graph (`/graph`)
* GitHub Actions integration – graph data (`static/data/notes_graph.json`) is rebuilt on **every deploy**
* Fully client-side, no external APIs required at runtime

---

## 🚀 Quick Start

```bash
# 1. Install Hugo Extended ≥ 0.110.0
#    https://gohugo.io/getting-started/installing/

# 2. Create a new site (or use an existing one)
hugo new site my-notes && cd my-notes

# 3. Add theme as a git submodule
git submodule add https://github.com/YourAccount/kidiverse.git themes/kidiverse

# 4. Enable the theme
echo 'theme = "kidiverse"' >> hugo.toml

# 5. Copy example config / content (optional)
cp -a themes/kidiverse/exampleSite/. .

# 6. Start the dev server
hugo server -D
```

Open <http://localhost:1313> and enjoy!

---

## 📝 Note-Taking Conventions

1. **Directory = Topic** – organise notes under `content/<topic>/<Note>.md`
2. **Attachments** – place images related to each note in `content/<topic>/attachments/`
3. Insert images simply as:
   ```markdown
   ![my diagram](diagram.png)        # resolves to /<topic>/attachments/diagram.png
   ![[diagram.png]]                  # Obsidian transclusion also works
   ```

---

## ⚙️ Configuration

```toml
baseURL = "https://example.com/"
languageCode = "en-us"
title = "My Knowledge Garden"

[params]
  description = "Personal Zettelkasten powered by KidiVerse"
```

(Advanced parameters such as colours, fonts, sidebar width are documented in `exampleSite/config.toml`.)

---

## 🤖 AI Semantic Graph

* **Script:** `scripts/build_graph.py`
  * Generates sentence embeddings using `sentence-transformers/all-MiniLM-L6-v2`
  * Computes top-k nearest neighbours with scikit-learn
  * Writes `static/data/notes_graph.json` consumed by the front-end
* **Front-end:** `static/js/graph.js` renders an interactive force graph with D3.

### GitHub Action
A ready-made workflow (`.github/workflows/build-graph.yml`) runs the script on every push / deploy:

```yaml
autocomplete: false
name: Build semantic graph
on:
  push:
    branches: [ "main", "development" ]
jobs:
  graph:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.11"
      - name: Install deps
        run: pip install -r requirements.txt
      - name: Build graph
        run: python scripts/build_graph.py
      - name: Upload artifact (optional)
        uses: actions/upload-artifact@v3
        with:
          name: graph
          path: static/data/notes_graph.json
```

Feel free to adapt – e.g. commit the JSON back, deploy to Netlify, etc.

---

## 📦 Packaging for Hugo Themes Gallery

If you wish to list KidiVerse (or your fork) on [themes.gohugo.io](https://themes.gohugo.io/):

1. **Open-source licence** – add `LICENSE` (MIT / Apache-2.0 …)
2. **`theme.toml`** – minimal metadata example:
   ```toml
   name = "KidiVerse"
   license = "MIT"
   licenselink = "https://github.com/YourAccount/kidiverse/blob/master/LICENSE"
   description = "AI-powered knowledge-base theme for Hugo"
   homepage = "https://github.com/YourAccount/kidiverse"
   tags = ["docs", "knowledge", "graph", "dark", "responsive"]
   features = ["semantic graph", "obsidian attachments", "dark mode"]
   min_version = "0.110.0"

   [author]
     name = "Your Name"
     homepage = "https://yourdomain.com"
   ```
3. **Screenshots** – place `images/screenshot.png` (≥1500×1000) and `images/tn.png` (≥900×600).
4. Optionally include an `exampleSite/` folder for quick-start.
5. Fork `gohugoio/hugoThemes`, add your repo to `themes.txt`, open a PR.

---

## 📜 Licence

KidiVerse is released under the **MIT Licence** – see [`LICENSE`](LICENSE).
