# Scheduler

負責決定新創建的 Pod 應該運行在哪個 Worker Node 上。它的目標是根據集群的資源情況、透過自己的策略和約束條件，將 Pod 分配到最適合的節點。

## 主要職責

- 監聽新創建的 Pod（尚未被分配到節點）
- 決定 Pod 應該運行在哪個節點（Where to run）
- 將調度決策寫回 API Server，通知 Kubelet 執行

## 其他特性

- **關注點**：Pod 的初次調度，確保資源分配合理且滿足約束條件
- **運作階段**：Scheduler 只在 Pod 創建時（尚未分配節點）介入，完成調度後其任務結束
- **運行環境**：Scheduler 作為一個獨立進程運行在 Master Node 上，通常與 API Server、etcd 等組件協作