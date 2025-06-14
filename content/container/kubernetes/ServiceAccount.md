# ServiceAccount

**ServiceAccount** 是 Kubernetes 用來讓 Pod 以特定身份運行的機制，主要用於對接 RBAC，讓 Pod 取得特定權限。

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
  namespace: default
```

## 使用方式

如果要讓 Pod 使用這個 ServiceAccount，可以這樣設定：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  namespace: default
spec:
  serviceAccountName: my-service-account
  containers:
  - name: my-container
    image: nginx
```
