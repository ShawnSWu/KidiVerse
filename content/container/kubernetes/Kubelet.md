# Kubelet

Kubelet 是運行在每個 Kubernetes Worker Node 上的代理（agent）。簡單來說，Kubelet 是 Worker Node 與 Master Node 之間的橋樑，負責執行任務並報告狀態。

它負責確保節點上的容器（由 Pod 定義）按照 Kubernetes Control Plane (Master Node) 發出的指令正確運行。

## 運行環境

Kubelet 以獨立進程的形式運行，通常由系統服務（如 systemd）管理。
