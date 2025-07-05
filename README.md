# KidiVerse – AI-Enhanced Hugo Note Theme

KidiVerse is a **Hugo static-site theme for Obsidian-style Markdown notebooks**.
It respects the typical Obsidian convention where **images live in an `attachments/` sub-folder** next to each note, and automatically resolves those links.
It offers a clean two-column dark layout that mirrors your folder structure and scales gracefully from small personal wikis to large knowledge gardens.

---
![image](https://github.com/user-attachments/assets/aa1ba180-094a-4e77-b560-58b6144f6e3b)
![image](https://github.com/user-attachments/assets/d963cf72-7331-4439-b9e1-12f58ac1ff73)


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

## 🧩 Obsidian Compatibility

Already keeping your notes in an Obsidian vault? Just copy them into `content/` and you’re ready to go:

1. **Drag-and-drop folders** – every folder becomes a sidebar section.
2. **Add an `_index.md`** in each folder so Hugo can render the section landing page & sidebar entry. A minimal example:

   ```markdown
   ---
   title: "Git"   # folder label in sidebar
   weight: 2       # optional ordering (lower = higher)
   ---
   ```

   (You can create these quickly with a script or your file manager.)
3. Keep images in the folder’s `attachments/` sub-directory – the theme will resolve links like `![diagram](diagram.png)` automatically.
4. Start `hugo server ‑D` and enjoy the same Obsidian structure with a searchable website + AI knowledge graph.

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
A ready-made workflow (`.github/workflows/knowledge-graph.yml`) runs the script on every push / deploy:

Feel free to adapt – e.g. commit the JSON back, deploy to Netlify, etc.

---

## 📜 Licence

KidiVerse is released under the **MIT Licence** – see [`LICENSE`](LICENSE).
