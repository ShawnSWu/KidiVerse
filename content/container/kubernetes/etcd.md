# etcd

etcd 是一個高可用的分布式 Key-Value 存儲系統，負責儲存所有配置數據、狀態資訊和 Meta data。它的主要職責包括：

- **儲存集群狀態**：保存所有 Kubernetes 資源的定義（例如 Pod、Service、Node、ConfigMap 等）及其當前狀態。
- **供 Master 組件使用**：為 API Server、Scheduler、Controller Manager 等提供數據存取。
## 高可用性與一致性

- **責任**：保證數據在多節點 etcd 集群中的一致性和可用性
- **功能**：
  - etcd 使用 **Raft 一致性算法**，確保多個 etcd 實例之間的數據同步，與 Kafka 使用的共識算法一樣
  - 即使某些 etcd 節點故障，集群仍能繼續運作（通常需要奇數節點，如 3 或 5 個）
- **重要性**：這保證了 Kubernetes Master 的高可用性，防止單點故障