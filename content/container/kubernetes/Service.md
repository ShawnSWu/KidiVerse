# Service

**Service** 是一種抽象資源，真正做事的是 Kube-Proxy。Service 提供固定的 IP 地址和 DNS 名稱，讓 Pod 可以跟其他 Object 溝通，Pod 就不會因為重啟後修改了 IP，導致與其他 Object 無法交流。

## 主要特性
- **負載均衡**：Service 可以將流量分發到多個 Pod。
- **服務發現**：通過 DNS 或環境變數讓應用程式找到 Service。
- **穩定端點**：無論後端 Pod 如何變化，Service 提供一致的訪問點。

## 常見類型

- **ClusterIP**：預設類型，僅 Cluster 內可訪問。
- **NodePort**：NodePort 就像是在 node 層開了一個洞(port)，這個洞可以直達 Service，讓外部流量可以進來到 service。
  ![](Pasted image 20250310100722.png)
  
- **LoadBalancer**：將 Service 暴露到外部，需雲提供商支援。
- **ExternalName**：映射到外部服務，無需代理。


### 示意

```diff
+----------------------+
|   外部客戶端          |
|   (訪問 NodeIP:30080)|
+----------------------+
         |
         v
+------------------+  
|  Kubernetes Node |  
|  (NodePort:30080)|
+------------------+  
         |  
         v  
+------------------+  
|   Service        |  
|   (Port: 80)     |  
+------------------+  
         |  
         v  
+------------------+  
|   Pod            |  
|   (TargetPort:8080) |  
+------------------+  
```


## EndPoint

EndPoints 就是指這個 Service 與幾個 Pod 連線了，以下圖為例，此 Service 的 endpoint 為 3 個。

![](Pasted image 20250310100925.png)
## 基本範例

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app: my-app
  ports:
    - port: 80           # Service 暴露的端口
      targetPort: 8080   # Pod 內部應用監聽的端口
      nodePort: 30080    # 節點上的靜態端口 (僅適用於 NodePort)
```