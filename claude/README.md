# 'Best Use of Claude' Challenge

This is a guide specially designed for the **'Best Use of Claude'** challenge. We will cover how to use the Claude API with some **Python** code snippets, as well as the various strengths of Claude, and what to bear in mind while using LLMs in general. It also includes an example of integrating Claude API in **JavaScript**.

## Table of Contents

<!-- TOC -->

- ['Best Use of Claude' Challenge](#best-use-of-claude-challenge)
  - [Table of Contents](#table-of-contents)
  - [How to use Claude API keys](#how-to-use-claude-api-keys)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Basic example](#basic-example)
      - [What happens?](#what-happens)
      - [With a system prompt](#with-a-system-prompt)
      - [Using cURL (raw API)](#using-curl-raw-api)
    - [Resources](#resources)
  - [What Claude is good at](#what-claude-is-good-at)
    - [Nuanced analysis and reasoning](#nuanced-analysis-and-reasoning)
    - [Substantial Writing Projects](#substantial-writing-projects)
    - [Developing Code and Debugging](#developing-code-and-debugging)
  - [General LLM weaknesses](#general-llm-weaknesses)
    - [Real-time or very recent information](#real-time-or-very-recent-information)
    - [Mathematical computation at scale](#mathematical-computation-at-scale)
    - [Generating highly-specific factual recall](#generating-highly-specific-factual-recall)
  - [Example Project](#example-project)
    - [File Structure](#file-structure)
    - [Backend (server.js)](#backend-serverjs)
  - [Going Further](#going-further)

<!-- /TOC -->

## How to use Claude API keys

### Prerequisites

You should already have signed up for Claude credits in advance, which should involve creating an account through [Anthropic Console](https://platform.claude.com/):

- Go to [Account Settings](https://platform.claude.com/settings/keys) and create a new API key
- Set an environment variable: `export ANTHROPIC_API_KEY="your-key-here"` (or add this variable to your project's root-level `.env` file)
- Check available models at [Claude Models List](https://platform.claude.com/docs/en/api/models-list)

### Setup

```bash
pip install anthropic
```

> [!note]
> Refer to the ['Getting Started' HackPack's Python section](/getting-started/README.md#python) if you're unsure how to get to this stage.

### Basic example

This example sends a prompt to Claude and retrieves a response. Claude analyses the request and returns generated content based on its training.

Edit the prompt message from the snippet as you please and save your code. We've gone for `quickstart.py` in this example.

```python
from anthropic import Anthropic

# Initialise client - automatically reads ANTHROPIC_API_KEY from environment
client = Anthropic()  # or pass api_key="your-key-here" explicitly

# Send a prompt and get a response
response = client.messages.create(
    model="claude-sonnet-4-5",  
    max_tokens=1000,  # Maximum response length
    messages=[
        {
        "role": "user", # Specifies the message is coming from the user (the role is "assistant" for responses from the LLMs) 
        "content": "What should I search for to find the latest developments in renewable energy?"}
    ]
)

# Extract and print the response
print(response.content) # This will be a TextBox
```

#### What happens?

1. The `Anthropic()` client connects to Claude's API using your API key
2. `messages.create()` sends your prompt to the model
3. Claude processes your request and generates a response
4. The response is stored in `response.content`

#### With a system prompt

System prompts define Claude's behavior, tone, and expertise. This is crucial for getting the right type of responses.

```python
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system="You are an expert Python developer. Always provide clean, well-documented code with type hints and docstrings. Include error handling.",
    messages=[
        {"role": "user", "content": "Write a function to validate email addresses."}
    ]
)

print(response.content[0].text)
```

#### Using cURL (raw API)

For integrations without language-specific SDKs, you can use the raw REST API after setting your API key:

```bash
curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1000,
    "messages": [
      {
        "role": "user", 
        "content": "What should I search for to find the latest developments in renewable energy?"
      }
    ]
  }'
```

### Resources

- [Claude API Overview](https://platform.claude.com/docs/en/api/overview)
- [Models List](https://platform.claude.com/docs/en/api/models-list) - Check latest available models
- [Working with Messages](https://platform.claude.com/docs/en/build-with-claude/working-with-messages)
- [Features Overview](https://platform.claude.com/docs/en/build-with-claude/overview) - Caching, vision, tool use, streaming, etc.

## What Claude is good at

### Nuanced analysis and reasoning

Claude API excels at processing **complex documents** and generating **structured analytical outputs**. Use it when building applications that need to parse lengthy contracts, compare multiple data sources, or generate detailed technical assessments. For example, integrate Claude into workflows that evaluate vendor proposals against procurement criteria, analyze customer feedback for sentiment and actionable insights, or generate compliance reports that synthesize information from multiple regulatory documents. Claude's **extended context window** (200K tokens) means you can feed it entire codebases, full research papers, or comprehensive document sets in a single API call for holistic analysis.

### Substantial Writing Projects

Claude is ideal for applications that generate long-form, coherent content programmatically. Build tools that create technical documentation from code repositories, generate personalized educational curricula, draft comprehensive client reports, or produce multi-chapter content. Claude maintains consistency in tone, terminology, and logical flow across extended outputs, making it particularly valuable for document generation pipelines, content management systems, or automated reporting tools where quality can't degrade across thousands of words. Use features like **system prompts** to define style guides and **prefill** assistant responses to maintain formatting consistency across generated documents.

### Developing Code and Debugging

Claude is strong at writing functional code, explaining complex codebases, debugging issues, and suggesting architectural improvements. It's particularly useful for creating complete, working applications rather than just snippets, and can work across multiple programming languages while maintaining best practices.

## General LLM weaknesses

Claude can be an incredibly powerful tool, but make sure to steer clear of these common pitfalls that can result from heavy LLM usage...

### Real-time or very recent information

Claude's reliable knowledge ends in January 2025. For anything happening after that date, including current news, recent developments, latest statistics, or breaking events, Claude needs to use **web search**. Don't assume Claude knows about recent events; if your question involves "current" or "latest" information, expect Claude to search or ask if it should.

> [!TIP]
> **How to work with this**: Simply ask your question and Claude will search when needed, or explicitly request "search for the latest information on..." if you want to be sure you're getting current data or you can also programatically add the [Web Search Tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool) to the Claude API request

### Mathematical computation at scale

While Claude can handle basic math and explain mathematical concepts well, it's prone to errors with complex calculations, large numbers, or extensive numerical operations. It's not a calculator replacement.

> [!TIP]
> **How to work with this**: For important calculations, use Claude to set up the problem or explain the methodology, but verify results with a calculator or computational tool. Claude is better at the "why" and "how" of math than grinding through arithmetic.

### Generating highly-specific factual recall

Claude sometimes struggles with highly specific facts, exact dates, comprehensive lists, or precise statistics, especially when it can't verify them through search. It might get close but miss details.

> [!TIP]
> **How to work with this**: When you need exact figures or comprehensive factual lists, ask Claude to search for authoritative sources rather than relying on its training data. It's better at analysis of facts than perfect recall of them.

## Example Project

The **[`example-project`](./example-project)** is a Node.js web application that demonstrates how to integrate Claude API into a full-stack application. It features an Express.js backend that communicates with the Claude API and a simple frontend interface. The app includes an endpoint that generates Python code examples using Claude, showcasing practical use cases for the Claude API in a real-world scenario. Explore [the output of the demo](https://claude-demo-wvix.onrender.com/) yourself!

### File Structure

```bash
/example-project
├── server.js           # The Backend (Node.js + Express)
├── public/
│   └── index.html      # The Frontend (HTML + Tailwind + JS)
├── package.json        # Dependencies & Scripts
├── .env                # Secrets (API Keys) - you need to add it yourself
└── .gitignore          # Tells git to ignore .env and node_modules
└── README.md           # A simple readme for setting this up on your own device
```

If you would like to try out this example project on your own device, please follow the instructions on the README.md file inside the example-project to set it up correctly.

### Backend (server.js)

The server provides a `/api/result` endpoint that fetches Claude API responses. Here's what it does:

```javascript
app.get('/api/result', async (req, res) => {
    // Validates that the API key is set
    if (!process.env.ANTHROPIC_API_KEY) {
        return res.status(500).json({ 
            error: 'Server missing API Key. Set ANTHROPIC_API_KEY in .env file.' 
        });
    }

    // Makes a POST request to Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-5",
            max_tokens: 1024,
            system: "You are an expert Python developer. Always provide clean, well-documented code with type hints and docstrings. Include error handling.",
            messages: [
                { role: "user", content: "Write a function to validate email addresses." }
            ]
        })
    });
    
    // Returns the generated content to the frontend
    res.json({ result: data.content[0].text });
});
```

The server demonstrates key concepts: **API key management**, **making authenticated requests** to Claude, **using system prompts** to define Claude's behavior, and handling **responses**.

## Going Further

Once you're comfortable with the basics, consider these advanced Claude API features to level up your hackathon project:

- **[Tool Use](https://platform.claude.com/docs/en/agents-and-tools/tool-use)** - Enable Claude to call external APIs, databases, and services. Build AI agents that interact with weather APIs, perform calculations, or query your backend systems.

- **[Vision](https://platform.claude.com/docs/en/build-with-claude/vision)** - Process images alongside text. Build OCR tools, image classifiers, chart analyzers, or visual question-answering systems by passing base64-encoded images or URLs.

- **[Text Embeddings](https://platform.claude.com/docs/en/api/embeddings)** - Generate vector representations of text for semantic search, similarity comparison, or RAG (Retrieval-Augmented Generation) systems. Perfect for building intelligent search or recommendation engines.

- **[Prompt Caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)** - Reduce costs and latency by caching long system prompts, large documents, or conversation context. Especially useful when repeatedly querying against the same codebase or documentation.

- **[Streaming](https://platform.claude.com/docs/en/build-with-claude/streaming)** - Get responses as they're generated for a more responsive user experience. Display text incrementally instead of waiting for the complete response.

- **Structured Outputs** - Use system prompts and parsing techniques to reliably extract JSON from Claude's responses. Ideal for data extraction pipelines and API integrations.
