# Consumer


## Reading from Kafka 🎣

A **consumer** pulls records from partitions and tracks its progress via offsets.

## Consumer Group Model

- **Same group id** → load shared; each partition ↔️ one consumer instance.
- **Different group id** → each group receives the data independently.

```bash
bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 \
  --topic orders --group billing-service --from-beginning
 ```

 ### Java Example (Kafka Clients)

 ```java
 Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("group.id", "billing-service");
props.put("enable.auto.commit", "false");
props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
consumer.subscribe(Arrays.asList("orders"));

while (true) {
  ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
  for (ConsumerRecord<String, String> r : records) {
    process(r);
  }
  consumer.commitSync(); // manual commit
}
 ```