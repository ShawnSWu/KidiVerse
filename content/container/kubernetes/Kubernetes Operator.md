# Kubernetes Operator
## 想像一下，你在使用 Kubernetes 部署 **Kafka** 時，通常需要設定一大堆的東西，例如：

- **Kafka Broker** 的數量（replicas）
- **StatefulSet**，確保每個 broker 都有穩定的網路名稱
- 配置存儲，確保每個 broker 都有持久化的磁碟
- **Zookeeper** 的設定（因為 Kafka 依賴 Zookeeper）
- 監控、健康檢查等
這些步驟在初次部署時可能沒問題，但當你需要升級、擴展或故障修復時，手動處理這些事情就變得麻煩了。
這時候，**Kafka Operator** 就可以幫你處理這一切，它是一個自動化的工具，負責監控並管理 Kafka 集群的生命週期。

## Operator 會做什麼？

1. **簡化配置**： 你只需要定義一個 **KafkaCluster CR**（自定義資源），告訴 Operator 你希望部署的 Kafka 配置，比如 broker 的數量、磁碟大小等。然後，Operator 就會根據這些設定幫你自動創建和管理所需的資源。
    
2. **自動擴展與調整**： 假設你的集群需要更多的 Kafka brokers，通常你會手動修改 `StatefulSet` 的副本數量。但是如果你使用 Kafka Operator，只需要更新 **KafkaCluster CR**，Operator 就會自動調整集群的大小。這樣你就不需要自己去一一修改每個 Pod 或 Resource。
    
3. **自動故障修復**： 如果某個 broker 宕機了，Kafka Operator 會自動檢測到並重新啟動它，或者替換掉故障的 broker。這樣可以確保集群始終處於健康狀態，無需人工干預。
    
4. **版本升級與配置管理**： 當 Kafka 有新的版本或需要進行配置變更時，Operator 會自動進行升級或配置更新，並且在過程中確保不會影響到集群的運行。

### 讓我們來詳細看看 Kafka Operator 的運作過程。假設你想部署一個簡單的 Kafka 集群，並且希望它有 3 個 broker。

```yaml
apiVersion: kafka.strimzi.io/v1beta2
kind: Kafka
metadata:
  name: my-kafka-cluster
  namespace: kafka
spec:
  kafka:
    version: 2.8.0
    replicas: 3  # 需要 3 個 Kafka broker
    listeners:
      - name: plain
        port: 9092
        type: internal
    storage:
      type: persistent-claim
      size: 100Gi  # 每個 broker 使用 100Gi 存儲
      class: standard
    config:
      log.retention.hours: 72
      log.segment.bytes: 1073741824
  zookeeper:
    replicas: 3  # 需要 3 個 Zookeeper 實例
    storage:
      type: persistent-claim
      size: 10Gi  # 每個 Zookeeper 使用 10Gi 存儲
      class: standard
  entityOperator:
    topicOperator: {}
    userOperator: {}

```

#### 當你創建了這個 **KafkaCluster** CR，**Kafka Operator** 會自動讀取 CR 中的設置，然後根據這些配置來創建相應的 Kubernetes 資源