# Hello, Pod! 

A **Pod** is the smallest deployable unit in Kubernetes.  
Think of it as a wrapper that holds one or more tightly-coupled containers sharing:

- **Network namespace** – they all see the same `localhost`.
- **Storage volumes** – optional persistent or ephemeral volumes.
- **Lifecycle** – scheduled, started, and stopped together.

---

## Minimal Pod Manifest

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello-pod
spec:
  containers:
  - name: app
    image: nginx:1.27-alpine
    ports:
    - containerPort: 80
