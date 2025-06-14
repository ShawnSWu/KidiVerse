# Custom Controller

Controller 就像是一個自動化的管理員，它會監聽某個資源的狀態，然後根據期望狀態（desired state）來調整實際狀態（current state），每個 Resource 都有自己的 controller。

舉個簡單的例子：

- **Deployment Controller** 確保你的 Pod 數量符合定義的 replicas。
- **Node Controller** 監控節點的健康狀態，確保故障節點上的 Pod 會被遷移。
- **我們的 FlightBooking Controller** 監聽 `FlightBooking` CR，然後幫我們執行機票預訂的邏輯！


## K8s Controller 主要由兩個核心概念組成：

1. **Informer（監聽機制）**
    - 負責監聽 K8s 資源 (監聽ETCD) 的變化（例如 `FlightBooking` CRD 被新增、更新、刪除）。
2. **Reconciler（調諧邏輯）**
    - 當有變更時，Controller 會執行對應的業務邏輯，例如：
        - 發送 API 請求到第三方航班預訂系統
        - 更新 `FlightBooking` 的狀態

## Controller 其實就是一段程式，一段拿來真正做事情的程式：
```go
package main

import (
    "fmt"
    "context"
    "k8s.io/client-go/kubernetes"
    "k8s.io/client-go/tools/cache"
)

// FlightBooking 資料結構
type FlightBooking struct {
    PassengerName string
    FlightNumber  string
    Departure     string
    Destination   string
    DepartureDate string
    SeatClass     string
}

// 處理新訂單
func handleNewBooking(obj interface{}) {
    booking := obj.(*FlightBooking)
    fmt.Printf("📌 新機票訂單：%s -> %s, 航班號: %s\n", booking.Departure, booking.Destination, booking.FlightNumber)
    fmt.Println("✈️ 正在向航班預訂系統發送請求...")
    // 這裡可以發送 API 請求到外部系統
    fmt.Println("✅ 預訂成功！")
}

// 啟動 Controller
func main() {
    clientset := kubernetes.NewForConfig(config) // K8s 客戶端
    informer := cache.NewSharedInformer(
        &cache.ListWatch{
            ListFunc:  listFlightBookings,
            WatchFunc: watchFlightBookings,
        },
        &FlightBooking{},
        0,
    )

    informer.AddEventHandler(cache.ResourceEventHandlerFuncs{
        AddFunc: handleNewBooking,
    })

    stopCh := make(chan struct{})
    informer.Run(stopCh)
}

```