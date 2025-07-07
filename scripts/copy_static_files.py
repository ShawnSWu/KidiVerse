#!/usr/bin/env python3
"""
Script to copy static files to the Hugo static directory.
Run this before building the site.
"""
import os
import shutil
from pathlib import Path

def copy_static_files():
    # Paths
    base_dir = Path(__file__).parent.parent
    static_dir = base_dir / 'static'
    data_dir = base_dir / 'data'
    
    # Create necessary directories
    (static_dir / 'data').mkdir(parents=True, exist_ok=True)
    
    # Copy notes_graph.json to static/data
    notes_graph_src = base_dir / 'data' / 'notes_graph.json'
    if notes_graph_src.exists():
        shutil.copy2(notes_graph_src, static_dir / 'data' / 'notes_graph.json')
        print(f"Copied {notes_graph_src} to {static_dir / 'data'}")
    else:
        print(f"Warning: {notes_graph_src} not found")
    
    # Copy other static files if needed
    # Example: shutil.copy2('src/file.txt', static_dir / 'file.txt')

if __name__ == "__main__":
    copy_static_files()
