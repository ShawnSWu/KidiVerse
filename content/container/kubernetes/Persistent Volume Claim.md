# Persistent Volume Claim

Persistent Volume Claim 是用戶對儲存資源的請求，像是一份「儲存租賃申請」。它由應用開發者創建，提供抽象層，讓用戶無需關心底層儲存細節。

## 主要特性
- **請求容量**：例如 2Gi。
- **存取模式**：與 PV 相同（ReadWriteOnce、ReadOnlyMany、ReadWriteMany）。
- **自動綁定**：會匹配一個符合條件的 PV。
- **StorageClass**（可選）：指定儲存類型。

## 工作流程
- 用戶創建 PVC。
- Kubernetes 匹配或生成 PV。
- Pod 使用 PVC 掛載儲存。

## 基本範例
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi