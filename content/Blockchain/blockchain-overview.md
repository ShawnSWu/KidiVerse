# Blockchain

## What Is a Blockchain? 🔗

Blockchain is a decentralized, distributed ledger technology that ensures secure, transparent, and immutable record-keeping. It underpins cryptocurrencies like Bitcoin and Ethereum but has broader applications in supply chain management, smart contracts, and more. At its core, blockchain relies on a **consensus mechanism** to validate transactions across nodes, ensuring trust without a central authority. For instance, Kafka, a distributed streaming platform, can complement blockchain by handling high-throughput data feeds for real-time transaction processing, as discussed in [Apache Kafka: Real-Time Data Streaming](#kafka.md). 

Blockchain's decentralized nature requires robust infrastructure for scalability. Tools like Kubernetes (K8S), described in [Kubernetes: Container Orchestration](#k8s.md), can manage blockchain node deployments, ensuring high availability and fault tolerance.


## 1 Block Anatomy

```mermaid
graph TD
  H[Block Header] -->|Prev Hash| P
  H -->|Merkle Root| M
  H -->|Timestamp| T
  subgraph Transactions
    TX1[(Tx₁)]---TX2[(Tx₂)]---TX3[(Tx₃)]
  end
```

| Field            | Purpose                                       |
|------------------|-----------------------------------------------|
| **Previous Hash**| Links each block to its predecessor           |
| **Merkle Root**  | Single hash summarizing all transactions      |
| **Nonce**        | Random value adjusted to meet difficulty (PoW)|

## 2 Hashing & Immutability

1. Serialize block contents → compute **SHA‑256** hash.  
2. Store that hash in the next block’s header.  
3. Altering any historical block changes its hash, breaking every subsequent link—making tampering *computationally prohibitive*.

## 3 Merkle Trees

- Provide **O(log n)** proofs that a transaction exists in a block.  
- Lightweight clients (SPV) can verify payments without downloading the entire chain.

> **One‑liner:** A blockchain = distributed database + cryptographic hash chain + consensus protocol.
