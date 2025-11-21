# Streaming Response | xAI

Streaming outputs is **supported by all models with text output capability** (Chat, Image Understanding, etc.). It is **not supported by models with image output capability** (Image Generation).

Streaming outputs use [Server-Sent Events (SSE)](https://en.wikipedia.org/wiki/Server-sent_events), which let the server send back the delta of content in event streams.

Streaming responses are beneficial for providing real-time feedback and enhancing user interaction by allowing text to be displayed as it is generated.

To enable streaming, set `"stream": true` in your request.

When using streaming output with reasoning models, you may want to **manually override the request timeout** to avoid prematurely closing the connection.

---

## Example: Python

import os
from xai_sdk import Client
from xai_sdk.chat import user, system

client = Client(
api_key=os.getenv('XAI_API_KEY'),
timeout=3600, # Override default timeout for reasoning models
)

chat = client.chat.create(model = "grok-4")
chat.append(
system("You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy."),
)
chat.append(
user("What is the meaning of life, the universe, and everything?")
)
for response, chunk in chat.stream():
print(chunk.content, end="", flush=True) # Each chunk's content
print(response.content, end="", flush=True) # The response object auto-accumulates the chunks
print(response.content) # The full response

---

You'll receive event streams like these:

### Example Stream Output

data: {
"id": "",
"object": "chat.completion.chunk",
"created": ,
"model": "grok-4",
"choices": [{
"index": 0,
"delta": {"content": " Ah ", "role": "assistant"}
}],
"usage": {"prompt_tokens": 41, "completion_tokens": 1, "total_tokens": 42, "prompt_tokens_details": {"text_tokens": 41, "audio_tokens": 0, "image_tokens": 0, "cached_tokens": 0}},
"system_fingerprint": "fp_xxxxxxxxxx"
}
data: {
"id": "",
"object": "chat.completion.chunk",
"created": ,
"model": "grok-4",
"choices": [{
"index": 0,
"delta": {"content": " , ", "role": "assistant"}
}],
"usage": {"prompt_tokens": 41, "completion_tokens": 2, "total_tokens": 43, "prompt_tokens_details": {"text_tokens": 41, "audio_tokens": 0, "image_tokens": 0, "cached_tokens": 0}},
"system_fingerprint": "fp_xxxxxxxxxx"
}
data: [DONE]

It is recommended to use a client SDK to parse the event stream.

---
