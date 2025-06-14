# User Account

Kubernetes 本身不直接儲存 User Account，而是依賴外部身分識別管理系統（如 OIDC、LDAP、X.509 憑證等）。

## 主要特性

- 管理員通常使用 kubectl 設定 kubeconfig 檔案進行身份驗證
- RBAC（基於角色的存取控制）用於管理使用者權限
- 需要透過憑證、OAuth 令牌、OIDC 或第三方身分提供者（如 Azure AD）來認證使用者

## 使用方式

概念上就是需要在 `kubeconfig` 裡加入 **Certificate（憑證）** 相關的配置，這樣 `kubectl` 才能使用該憑證進行身份驗證。