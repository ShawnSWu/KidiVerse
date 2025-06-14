# Pod

- Pod 是 Kubernetes 中最小的部署單元。
- 一個 Pod 可以包含一個或多個 Container，這些 Container 共享儲存和網路資源。

Pod 通常用來運行單一應用或服務。

## 主要特性
- **共享資源**：Pod 內的容器共享 IP 地址和儲存卷（Volume）。
- **生命週期**：Pod 是一次性的，當它被刪除時不會自動重建，需要依賴控制器（如 Deployment）。
- **調度單位**：Kubernetes 以 Pod 為單位進行調度和部署。
## 基本範例
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  containers:
  - name: nginx
    image: nginx:latest