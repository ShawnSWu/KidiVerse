# Persistent Volume

提供持久化儲存的資源，獨立於 Pod 生命週期，它允許數據在 Pod 重啟或刪除後仍然保留，並可供多個 Pod 共享使用。

> **Persistent Volume (PV)** 就像一台共用雲端硬碟，無論你換哪台筆電 (Pod)，只要有權限都能連回去存取同樣的資料。

## 簡單流程

1. **管理員 (Cluster Admin)** 創建 **PV** (定義可用的存儲)。
2. **開發者 (User)** 在 Pod 裡宣告 **PVC** (請求存儲資源)。
3. **K8s 自動匹配 PVC 和合適的 PV**，然後 Pod 就可以用這塊存儲。

## 主要特性
- **獨立性**：PV 作為集群級資源，與 Pod 分離管理。
- **存取模式**：支援以下幾個模式
  - ReadWriteOnce（單節點讀寫）
  - ReadOnlyMany（多節點唯讀）
  - ReadWriteMany（多節點讀寫）
- **回收策略**：可設定為 
  - Retain（保留） => 即使 PVC 被刪除，PV 仍然保留，不會刪除存儲裡的資料。
  - Delete（刪除） => 當 PVC 被刪除時，PV 和 **後端存儲 (如 AWS EBS, Azure Disk, GCE Persistent Disk)** 也會一起刪除。
## 與 PVC 的關係

- **Persistent Volume (PV)**  
  K8s 內部管理的 **存儲資源**，可以來自 NFS、Ceph、AWS EBS、Azure Disk 等存儲後端。
- **Persistent Volume Claim (PVC)**  
  Pod 不會直接請求 PV，而是透過 **PVC** 來申請存儲空間，就像申請一個雲端硬碟配額。

## 基本範例
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: example-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  hostPath:
    path: "/mnt/data"