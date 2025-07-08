# Kafka Streams API

The **Kafka Streams** library turns a Kafka cluster into a fully-fledged, fault-tolerant stream-processing engine without requiring a separate cluster like Flink or Spark.

## 1 DSL vs Processor API

| Layer | What It Offers | Example |
|-------|----------------|---------|
| **DSL** | Map/Filter/Join/KTable abstractions | `orders.groupByKey().windowedBy(tumblingWindow)` |
| **Processor API** | Low-level access to topology nodes | Custom watermarking logic |

## 2 State Stores

- Backed by **RocksDB** + **changelog topics**.
- Enables exactly-once windowed aggregations.

## 3 Interactive Queries

> Expose local store via REST to query materialised views in real time.

## 4 Connecting Notes

- Consumed by **Smart Contracts** or on-chain oracles to feed live market data (see [Blockchain Overview](../Blockchain/blockchain-overview.md)).
- Deployed on **Kubernetes Pods** (see [K8S Pod](../container/Kubernetes/Pod.md)) using sidecar pattern.
