# Authorization

k8s 的 **Authorization Mode**（授權模式）是指 Kubernetes API server 如何決定請求是否被允許執行特定操作。Kubernetes 提供了多種授權模式。

## 主要的 Authorization Mode

- **Node（節點授權）**
    - 主要用於 kubelet 對 API Server 的請求，例如獲取 Pod 資訊或報告狀態。
    - 透過 Node 授權模式，Kubernetes 會根據 Node 的標籤來限制它能存取的資源範圍。
- **RBAC（Role-Based Access Control，基於角色的存取控制）**
    - 最常用的授權模式，基於 **Role**（角色）和 **RoleBinding**（角色綁定）來決定用戶、群組或 ServiceAccount 的權限。
    - 支援 `ClusterRole` 和 `ClusterRoleBinding` 來授權整個集群範圍的權限。
- **ABAC（Attribute-Based Access Control，基於屬性的存取控制）**
    - 透過 JSON 或 CSV 格式的策略文件來設定權限，允許基於請求的屬性（例如 user、namespace、resource）來做細粒度控制。
    - 需要在 API Server 啟動時指定 `--authorization-policy-file` 來加載策略文件。
- **Webhook**
    - Kubernetes 會將授權請求轉發給外部 HTTP API 服務，由該服務決定是否允許請求。
    - 適用於需要更動態或複雜授權策略的情境，例如基於企業身份管理系統的存取控制。