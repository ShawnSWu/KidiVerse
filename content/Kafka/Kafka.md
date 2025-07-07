# Kafka

Apache Kafka is a **distributed, append-only commit log** designed for high-throughput, fault-tolerant event streaming.

## Key Building Blocks

| Term           | What It Means                                           |
|----------------|---------------------------------------------------------|
| **Topic**      | Named stream of records                                 |
| **Partition**  | Ordered, immutable log segment within a topic           |
| **Producer**   | Client that appends records to partitions               |
| **Consumer**   | Client that reads records from partition offsets        |
| **Broker**     | Server that stores partitions and serves client traffic |
| **Controller** | Coordinates leadership, ISR, and cluster metadata       |

---

## Why Kafka?

- **Durable:** Replicated logs guarantee data isn’t lost.
- **Scalable:** Horizontal scale via partitions and broker sharding.
- **Realtime:** Millisecond latencies with back-pressure control.
- **Versatile:** Serves as message bus, database CDC pipe, or stream-processing backbone.

---

## High-Level Architecture

```mermaid
flowchart LR
  subgraph Cluster
    B1[Broker 0] --- B2[Broker 1]
    B1 --- B3[Broker 2]
    B2 --- B3
  end
  P[(Producers)] -->|writes| B1
  C[(Consumers)] -->|reads| B2
    Consumer -->|read| B
