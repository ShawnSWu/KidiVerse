# RoleBinding

用來將 **Role** 綁定到指定的「使用者、群組或 ServiceAccount」，讓它們擁有對應的權限。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pod-reader-binding
  namespace: default
subjects:
- kind: User  # 或者是 ServiceAccount / Group
  name: Shawn
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

**說明：** 上面例子來說，把 User Shawn 跟 pod-reader 這個 Role 綁定。
