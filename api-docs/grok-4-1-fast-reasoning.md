# Grok 4.1 Fast

**Model ID:** `grok-4-1-fast-reasoning`

## Overview

Grok 4.1 Fast is a frontier multimodal model optimized specifically for high-performance agentic tool calling. It features reasoning capabilities, meaning the model thinks before responding.

## Key Information

* **Aliases:**
  * `grok-4-1-fast`
  * `grok-4-1-fast-reasoning-latest`
* **Context Window:** 2,000,000 tokens
* **Modalities:** Multimodal

## Capabilities

* **Function Calling:** Connect the xAI model to external tools and systems.
* **Structured Outputs:** Return responses in specific, organized formats.
* **Reasoning:** The model utilizes a "thinking" process before generating a response to improve accuracy and logic.

## Pricing

Pricing is calculated per million tokens, with a separate charge for live search sources.

| Usage Type | Price | Unit |
| :--- | :--- | :--- |
| **Input** | $0.20 | Per 1M tokens |
| **Cached Input** | $0.05 | Per 1M tokens |
| **Output** | $0.50 | Per 1M tokens |
| **Live Search** | $25.00 | Per 1K sources |

> **Note:** Different rates apply for requests that exceed the 128K context window.

## Regional Availability & Limits

The model is available in the following regions with consistent pricing and rate limits.

| Metric | us-east-1 | eu-west-1 |
| :--- | :--- | :--- |
| **Requests per minute (RPM)** | 480 | 480 |
| **Tokens per minute (TPM)** | 4,000,000 | 4,000,000 |

## Usage Tips

* **Cached Tokens:** Using cached input tokens can significantly reduce costs ($0.05 vs $0.20 per 1M tokens).
* **Context:** While the model supports a 2M context window, be aware of higher context pricing for requests exceeding 128K tokens.
