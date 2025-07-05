# Docker?

- **Consistent environments** – “It works on my machine” becomes a thing of the past.  
- **Lightweight isolation** – share the host kernel yet run apps in separate sandboxes.  
- **Fast shipping** – build once, run anywhere that supports the Docker runtime.  
- **Rich ecosystem** – tap into Docker Hub and countless community images.  

---

## Core Concepts

| Term | In Plain English |
|------|------------------|
| **Image** | A read-only template (think: snapshot of an OS + your app) |
| **Container** | A running instance of an image—ephemeral and isolated |
| **Dockerfile** | Recipe that tells Docker how to build an image |
| **Registry** | Remote store for images (e.g., Docker Hub, GitHub Container Registry) |
| **Docker Engine** | The daemon (`dockerd`) that builds, runs, and manages containers |

---

## Hello, World!

```bash
docker run --rm hello-world
