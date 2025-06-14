# API Group

![API Group](Pasted%20image%2020250610235209.png)


## 為什麼 Kubernetes 需要 API Group？

在 Kubernetes 裡，API Group 主要是為了 **組織資源、支援版本控制、擴展 API**，讓整個系統更靈活、更容易管理。

- 🏷 **分類不同類型的資源** 👉 避免名稱衝突，讓相似的資源歸類
- 🔄 **支援 API 版本更新** 👉 允許新舊版本共存，讓升級更平滑
- ⚡ **擴展 API，支援 CRD** 👉 讓開發者可以定義自己的 API
- 🔒 **RBAC 權限控制更細緻** 👉 允許針對不同 API Group 設定權限

## **常見的 API Groups**

|API Group|用途|例子|
|---|---|---|
|(core, 無 Group)|核心資源|Pod、Service、ConfigMap|
|`apps`|應用管理|Deployment、StatefulSet、DaemonSet|
|`batch`|批次處理|Job、CronJob|
|`networking.k8s.io`|網路相關|Ingress、NetworkPolicy|
|`rbac.authorization.k8s.io`|權限管理|Role、ClusterRole、RoleBinding|
|`apiextensions.k8s.io`|擴展 API|CustomResourceDefinition (CRD)|

📌 **核心 API (`core`) 沒有 API Group，所以 `apiVersion: v1`**，但其他 API Group 需要加上對應的名稱，例如 `apps/v1`。

## 🎯 **如何在 YAML 裡使用 API Group？**

API Group 主要出現在 `apiVersion` 這個欄位，格式是：

```yaml
apiVersion: <API Group>/<版本>
kind: <資源類型>
metadata:
  name: example
```

📝 **範例：不同 API Group 的 YAML**

🔹 **Deployment（屬於 `apps` API Group）**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
```

🔹 **Ingress（屬於 `networking.k8s.io` API Group）**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
```

🔹 **Pod（核心 API，沒有 API Group）**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
```