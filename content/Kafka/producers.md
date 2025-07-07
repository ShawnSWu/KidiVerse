# Producers

## Writing to Kafka 🚚

A **producer** publishes records to one or more topic partitions.

## CLI Quick Start

```bash
bin/kafka-console-producer.sh --bootstrap-server localhost:9092 \
  --topic orders
> {"orderId":"A42","amount":99.9}
```


### Python Example (kafka-python)
```python
from kafka import KafkaProducer
import json, uuid

producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v).encode(),
    acks="all",              # strongest durability
    retries=5,
    enable_idempotence=True  # per-partition exactly-once
)

event = {"orderId": str(uuid.uuid4()), "amount": 42.0}
producer.send("orders", value=event)
producer.flush()
```