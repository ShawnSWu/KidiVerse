# Custom Resource Definition

Kubernetes 原生提供的資源（像是 Pod、Service、Deployment）已經很好用了，但有時候我們想要定義自己的資源類型，比如「訂單管理系統」可能需要 `Order` 這種自定義的資源。這時候，**CRD（Custom Resource Definition）** 就派上用場了！

簡單來說，CRD 讓我們可以在 Kubernetes 中創建新的 API 物件，就像內建的 Pod 一樣操作它們。

### CRD 的基本架構

在 Kubernetes 中，CRD 本身是一種 API 資源，當我們定義了一個 CRD，K8s 會自動幫我們註冊這個新的 API 類型。

#### 以下是一個以“訂機票”的例子，我們創建了訂機票物件

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: flightbookings.example.com  # CRD 名稱，格式 <plural>.<group>
spec:
  group: example.com                # API 群組
  names:
    kind: FlightBooking             # 自定義資源的單數名稱
    plural: flightbookings          # 自定義資源的複數名稱
    singular: flightbooking         # 可選，單數形式
    shortNames:
      - fb                          # 可選，kubectl get fb
  scope: Namespaced                  # 可選: "Namespaced" or "Cluster"
  versions:
    - name: v1
      served: true                   # 是否提供這個 API 版本
      storage: true                   # 是否是存儲的版本
      schema:
        openAPIV3Schema:              # 定義 CRD 資源的 schema
          type: object
          properties:
            spec:
              type: object
              properties:
                passengerName:
                  type: string
                  description: "乘客名稱"
                flightNumber:
                  type: string
                  description: "航班號碼"
                departure:
                  type: string
                  description: "出發機場"
                destination:
                  type: string
                  description: "目的地機場"
                departureDate:
                  type: string
                  format: date
                  description: "出發日期"
                seatClass:
                  type: string
                  enum: ["Economy", "Business", "First"]
                  description: "艙等（經濟艙/商務艙/頭等艙）"

```

**重要屬性說明：**

- **served**：控制該版本是否可以被 Kubernetes API 伺服器提供並且用於操作 CR 資源（創建、更新、讀取）。
- **storage**：指定該版本是否是主存儲版本，決定 Kubernetes 在 etcd 中存儲資源數據時使用的版本。