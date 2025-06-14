# CRI (Container Runtime Interface)

Kubelet 通過 CRI 與 Container Runtime 通信，具體交互包括：

- **創建容器**：Kubelet 告訴 Container Runtime 啟動 Pod 內的容器。
- **管理容器生命周期**：Create, Start, Stop, Delete。
- **監控容器狀態**：Container Runtime 會報告容器的運行狀態（例如 Running、Stopped、Failed）給 Kubelet。
- **日誌與資源管理**：Container Runtime 負責收集容器日誌並管理容器的資源分配（CPU、內存等）。