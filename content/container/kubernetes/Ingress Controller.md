# Ingress Controller

Ingress Controller 就是真實的 Ingress 的實現。它監聽 Ingress 資源並將外部流量路由至對應服務，通常以 Pod 形式運行。

## 主要特性
- **流量管理**：解析 Ingress 配置並執行路由與負載均衡。
- **擴展性**：支援多種實現，如 Nginx、HAProxy、Traefik。
- **動態更新**：自動根據 Ingress 資源變化調整路由。

## 基本範例
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-ingress-controller
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ingress-nginx
  template:
    metadata:
      labels:
        app: ingress-nginx
    spec:
      containers:
      - name: nginx-ingress
        image: nginx/nginx-ingress:latest