# Admission Controller

## 在 Kubernetes 中，Admission Controllers 是一種用來攔截並處理對 Kubernetes API 伺服器的請求的機制。用於在資源（如 Pod、Deployment 等）被創建、更新或刪除時，攔截並處理這些請求。它們在請求通過身份驗證（Authentication）和授權（Authorization）後，但在資源被持久化到 etcd 之前執行。

### 簡單來說，Admission Controllers 是 Kubernetes 的「守門員」，確保進入系統的資源（如 Pod、Deployment 等）符合預期規則或策略。

## Admission Controllers 是在 API Server 的請求處理流程中執行的，分為兩個「抽象」的種類

1. **驗證（Validating Phase）**：檢查請求是否符合規則，如果不符合就拒絕。
2. **修改（Mutating Phase）**：在請求被接受之前，可以修改資源的內容（例如自動添加 side car 容器、設定預設值等）。


![Admission Controller Flow](Pasted%20image%2020250314100151.png)


## 為什麼說是抽象的？

- **沒有單獨的「Mutating」或「Validating」控制器**：
    - Kubernetes 沒有某個單獨的Controller叫「Mutating」或「Validating」。這些只是功能的抽象描述。
    - 具體的控制器（例如 LimitRanger、PodSecurity、MutatingWebhook）是實現這些功能的實體，它們被設計為執行 Mutating 或 Validating 的任務。