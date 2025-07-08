# Prompt Engineering

Prompt engineering is the craft of writing and iterating prompts so that large language models (LLMs) like GPT-4 can generate useful, reliable output.

## 1 Why It Matters

LLMs are **probabilistic next-token predictors**; the prompt is the only controllable input a practitioner has at inference time. Well-designed prompts can:

- Steer model behaviour (tone, format, persona).
- Inject background knowledge or constraints.
- Chain multiple reasoning steps (see *Chain-of-Thought*).

> **Example:** Adding "You are a senior blockchain architect" at the start of a prompt can orient the model to produce enterprise-grade design guidance.

## 2 Techniques

| Technique                | Description                                   | When to Use |
|--------------------------|-----------------------------------------------|-------------|
| **Few-Shot**             | Supply 1-5 examples in the prompt             | Small labelled data, rapid prototyping |
| **Chain-of-Thought (CoT)**| Ask the model to "think step by step"         | Reasoning & maths |
| **Self-Consistency**     | Sample multiple CoT paths, majority vote      | Reduce hallucination |
| **Retrieval Augmented**  | Embed query ⟶ fetch relevant docs ⟶ append    | Long-tail knowledge (see [RAG Guide](../rag_guide.md)) |

## 3 Connecting to Other Topics

Prompt engineering complements **Fine-Tuning** techniques (see [Fine-Tuning Transformers](./fine-tuning.md)) when you need task-specific accuracy. It also intersects with **Kafka Streams** for real-time prompt pipelines and with **Smart Contracts** (see [Smart Contracts](../Blockchain/smart-contracts.md)) when LLMs are used to analyse on-chain data.

---

*Further Reading*: [Deep Dive into LLM Architecture](./llm-architecture.md)
