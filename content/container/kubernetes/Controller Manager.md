# Controller Manager

Controller Manager 像是“狀態管理者”，負責確保集群的當前狀態與預期狀態一致。

- **核心職責**：監控和修復Cluster狀態（Ensure desired state），例如透過Replicasets 維持 Pod 副本數、更新 Service 端點。
- **關注點**：集群資源的持續管理，處理運行時的動態變化（如 Pod 故障、節點宕機）。
- **運作階段**：Controller Manager 持續運行，通過控制循環（Control Loop）不斷檢查和調整集群狀態。

## 自愈能力

Controller Manager就是 K8S「自愈」能力的關鍵，確保集群在故障或變化時自動恢復。

- 它支持自動擴展、負載均衡和資源管理，是集群穩定的基石。