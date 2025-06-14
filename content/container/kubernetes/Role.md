# Role

**Role** 是 Kubernetes 中用來設定「特定 Namespace」內資源操作權限的物件。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]  # "" 代表 core API group
  resources: ["pods"]
  verbs: ["get", "list"]  # 允許讀取 Pod 資訊
```
**說明：** 上面的範例代表著這個角色有著對「pod」執行「get」和「list」操作的權限。