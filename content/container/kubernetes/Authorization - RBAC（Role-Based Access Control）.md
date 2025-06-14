# Authorization - RBAC（Role-Based Access Control）

最常見的驗證方式，它透過定義「角色」來管理權限，再把這些角色指派給特定的「使用者、群組或 ServiceAccount」。

## 主要概念

### 1. **Role & ClusterRole**（定義權限）

- **Role**：限定在「某個 Namespace」內的權限。
    
- **ClusterRole**：適用於整個叢集（Cluster），不受 Namespace 限制。