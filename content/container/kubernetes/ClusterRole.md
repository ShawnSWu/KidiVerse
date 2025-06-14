# ClusterRole

適用於整個 **集群（Cluster）**，不限於特定命名空間。

- 用來定義集群範圍的資源（如 Node、PersistentVolume）或跨所有命名空間的資源（如所有命名空間中的 Pod）的訪問權限。
- **場景**: 當你需要管理集群級別的資源，或者需要跨命名空間統一應用權限時，使用 ClusterRole。例如，集群管理員需要查看所有命名空間的資源。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cluster-pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"]
```