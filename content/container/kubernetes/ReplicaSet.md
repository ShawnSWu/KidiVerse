# ReplicaSet

ReplicaSet（RS） 是 Kubernetes 中的一種控制器，負責確保指定數量的 Pod 副本（replica）始終運行，支持更靈活的 **Label Selector**。

**主要功能：**

- 保證 **指定數量** 的 Pod 運行
- **自動恢復** 當 Pod 異常終止時
- 透過 **Label Selector** 管理 Pod

## 重要特性

- Label Selector 必須匹配 **template.metadata.labels**，否則 Pod 不會被管理。
- **--cascade=orphan** 讓 Pod 不會被刪除，但 RS 會消失。 
- ReplicaSet 主要用於 Deployment，而不會單獨使用。考試更常見 Deployment。
- RS 只會補足 Pod，不會自動升級 Pod（這是 Deployment 的功能）。
- 如果 **replicas: 0**，所有 Pod 會被刪除，但 RS 本身還在。
- 可以使用 **kubectl scale** 或 **kubectl edit** 動態調整副本數。