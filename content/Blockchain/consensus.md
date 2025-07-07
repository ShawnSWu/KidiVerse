# Consensus Mechanisms

## Why Consensus?

In a trustless network, a **consensus algorithm** decides which block becomes the canonical next block, preventing double‑spends and fork inflation.

| Mechanism      | Core Idea                          | Pros                     | Cons                        |
|----------------|------------------------------------|--------------------------|-----------------------------|
| **PoW**        | Hash puzzle; highest hash‑rate wins| Battle‑tested security   | Energy‑intensive, low TPS   |
| **PoS**        | Stake‑weighted random selection    | Eco‑friendly, high TPS   | “Rich‑get‑richer,” complex  |
| **dPoS**       | Token holders elect delegates      | Second‑level scalability | Potential centralization    |
| **PBFT / Tendermint** | 3‑phase voting, ≤⅓ faulty ok | Low latency, finality    | Hard to scale > 100 nodes   |

## 1 Proof of Work (PoW)

```text
Goal: find nonce s.t. block_hash < difficulty_target
Difficulty retarget: every 2 016 blocks (Bitcoin)
```

### 51 % Attack Cost

Gaining >50 % of global hash power is astronomically expensive—economic incentives keep attackers honest.

## 2 Proof of Stake (PoS)

- Validator probability ∝ coins staked.  
- **Slashing** penalizes equivocation or downtime.  
- Attack cost = losing stake, not wasting electricity.

> **Trade‑offs:** balance security, decentralization, energy, and finality speed.
