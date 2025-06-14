# Kube-Proxy
Kube-Proxy 是一個運行在每個 Worker Node 上的網路代理（network proxy），其主要職責是實現 Kubernetes 服務（Service）的網絡通信功能。

簡單來說，Kube Proxy 負責確保 Pod 之間、Pod 與外部客戶端之間的流量能夠正確路由，會去偏測Service的狀態且與負載均衡。

## 主要職責
- **監聽 Kubernetes API Server，獲取 Service 和 Endpoint 信息。**
- **維護網絡規則（如 IPTables 或 IPVS），實現流量轉發。**
- **提供服務發現和負載均衡功能。**