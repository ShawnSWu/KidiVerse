# broker

## Inside a Kafka Broker 🖥️

A **broker** is a server process that:

1. Stores partition data on disk.  
2. Serves produce/consume requests via the TCP protocol.  
3. Replicates partition leaders to followers.  
4. Participates in cluster metadata quorum (ZooKeeper or KRaft).

---

## Essential Broker Configs

| Property                   | Purpose                                  |
|----------------------------|------------------------------------------|
| `num.partitions`           | Default partition count for new topics   |
| `log.retention.hours`      | Delete segments older than X hours       |
| `log.segment.bytes`        | Segment size before roll-over            |
| `log.cleanup.policy`       | `delete` or `compact`                    |
| `replica.lag.time.max.ms`  | Max follower lag before kicking from ISR |
| `auto.create.topics.enable`| Disable in prod; create topics explicitly|

---

## Operational Checklist

1. **Replication Factor ≥ 3** for multi-AZ resilience.  
2. **Disk layout:** Separate data and log instances; use XFS/ext4 on SSD/NVMe.  
3. **Monitoring:** Track `UnderReplicatedPartitions`, `IsrShrinks`, CPU, and disk I/O.  
4. **TLS & SCRAM:** Encrypt inter-broker and client traffic; enforce authN.  
5. **Rolling Upgrades:**  
   ```text
   bump IBP → upgrade brokers → migrate metadata (if KRaft)
