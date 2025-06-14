# ClusterRoleBinding

用來將 **ClusterRole** 綁定到指定的「使用者、群組 Group 或 ServiceAccount」，讓它們擁有對應的權限。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cluster-admin-binding
subjects:
- kind: User
  name: "admin-user"  # 使用者名稱
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: cluster-admin  # 綁定的 ClusterRole 名稱
  apiGroup: rbac.authorization.k8s.io
```

**說明：**這個範例把 cluster-admin（一個內建的 ClusterRole，擁有幾乎所有權限）綁定給使用者 admin-user，讓他在整個集群有管理權限。