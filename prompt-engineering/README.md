# Prompt Engineering

In this guide you will find useful information about setting up APIs for different LLMs and also how to prompt them effectively.

## What is Prompt Engineering?

Prompt engineering is a new and emerging art of crafting instructions to get LLMs like [ChatGPT](https://chatgpt.com), [Claude](https://claude.ai/), [Gemini](https://gemini.google.com/) and others, to produce the output you want. The better the instructions, the better the results!

## Core Principles

### 1. Be Specific and Detailed

Vague prompts get vague results. Include details such as the language, format, length, style and constraints.

❌ **Weak:**
```txt
Write a function to sort data
```

✅ **Strong:**
```txt
Write a Python function that takes a list of dictionaries representing users 
(with 'name', 'age', 'score' fields) and returns them sorted by score in 
descending order. Include type hints and a docstring.
```
### 2. Provide Context

Give the LLM all the information it needs. This includes relevant code, error messages, requirements and background.

❌ **Weak:**
```txt
Fix this bug
```
✅ **Strong:**
```txt
I'm getting a "TypeError: 'NoneType' object is not subscriptable" error on line 45.
Here's the relevant code:

[code snippet]

The function should return a dictionary but sometimes gets None from the API call.
How can I handle this case gracefully?
```

### 3. Set the Role / Persona

Tell the LLM what perspective to take. This helps shape the tone, depth and approach.

**Examples:**

 - "You are an expert Python developer reviewing code for security vulnerabilities..."
 - "Act as a patient teacher explaining React hooks to a beginner..."
 - "You are a technical documentation writer creating API reference docs..."

### 4. Use Examples
Show the model what you want with 1-3 examples. This can be incredibly powerful for formatting and style.

**Example:**
```txt
Convert these user inputs into structured JSON:

Input: "Meeting with Sarah tomorrow at 3pm"
Output: {"type": "meeting", "person": "Sarah", "time": "15:00", "date": "tomorrow"}

Input: "Remind me to call the dentist on Friday"
Output: {"type": "reminder", "action": "call", "person": "dentist", "date": "Friday"}

Input: "Lunch with the team next Tuesday at noon"
Output:
```

### 5. Break Down Complex Tasks

❌ **Weak:**
```txt
Build me a complete web scraper that extracts product data, stores it in a database, and generates visualizations
```

✅ **Strong:**

```txt
Write a function to scrape product names and prices from this HTML structure
```

```txt
Now add database insertion using SQLAlchemy for the scraped data
```

```txt
Create a visualization function that plots price trends over time
```

### 6. Specify Output Format

Be explicit about how you want your response to be structured.

**Examples:**
- "Respond only with valid JSON, no explanation"
- "Format your response as a numbered list"
- "Write this as a Git commit message following conventional commits format"
- "Return a Python dictionary with keys: 'status', 'data', 'error'"

### 7. Use Delimiters for Clarity

Use markers to separate different parts of your prompt, especially when including code, error messages or data.

**Example:**
````txt
Analyze this code for bugs:
```python
[your code here]
```

Focus on: null pointer exceptions, array bounds, and type mismatches
````

### 8. Set Constraints and Guardrails

Tell the model explicitly what ***not*** to do or what limits to expect.

**Examples:**

 - "Keep your response under 100 words"
 - "Don't use any external libraries beyond the Python standard library"
 - "Avoid using deprecated jQuery methods"
 - "Don't include any placeholder or TODO comments—only working code"

### 9. Iterate and Refine

Your first prompt rarely works perfectly. Treat it more like a conversation:

```txt
Create a REST API endpoint
```

```txt
Add input validation for the email field
```

```txt
Use Pydantic for the validation instead of manual checks
```

## Common Pitfalls to Avoid

 - **Being Too Polite** - LLMs don't have feelings, be direct and clear
 - **Assuming Context** - The model may not accurately remember past conversation. This is especially true in API calls. Always provide full context.
 - **Asking Multiple Unrelated Questions** - Stick to one task per prompt.
 - **Ignoring Token Limits** - Very long prompts or requests for large outputs can hit limits and degrade quality. Prefer smaller chunks.

## More Advanced Techniques

### Chain of Thought

For more complex reasoning tasks, ask the LLM to show its work and thought process. 

**Example:**
```txt
A store has 15 apples. They sell 40% and then receive a shipment that doubles 
their remaining stock. How many apples do they have now?

Solve this step by step, showing your calculation at each stage.
```

### Comparative Analysis

For important decisions (maybe about the direction of your project), ask the model to consider multiple approaches.

**Example:**
```txt
Propose three different architectures for this microservices system, 
then evaluate the pros and cons of each.
```

### Prompt Templates

Create reusable templates for common tasks.

**Example for Code Review:**
````txt
Review this [LANGUAGE] code for:
- Bugs and logical errors
- Performance issues
- Security vulnerabilities
- Code style and best practices

Code:
```[LANGUAGE]
[CODE]
```


Provide specific line-by-line feedback.
````

## ICHack-Specific Tips

### Rapid Prototyping

 - Start with "Create a minimal working example of..."
 - Ask for "Quick and dirty" solutions first, optimise later
 - Request boilerplate, LLMs often strip it

### Debugging Under Pressure

 - Include the full error traceback
 - Mention the steps you have already tried
 - Ask for multiple potential causes

### For Learning New Tech Fast

 - "Explain [TECHNOLOGY] as if I am familiar with [TECHNOLOGY YOU KNOW]"
 - Tell the LLM about your technical background
 - Request minimal examples: "Show me the simplest way to..."

## LLM APIs

In this section, we will focus on Claude, ChatGPT, and Gemini specifically, with code examples for prompting them via API.

### Claude

**Prerequisites:**
- Create an account at [Anthropic Console](https://platform.claude.com/)
- Go to [Account Settings](https://platform.claude.com/settings/keys) and create a new API key
- Set environment variable: `export ANTHROPIC_API_KEY="your-key-here"` (or add to `.env` file)
- Check available models at [Claude Models List](https://platform.claude.com/docs/en/api/models-list)

**Setup:**
```bash
pip install anthropic
```

**Basic Example:**
This example sends a prompt to Claude and retrieves a response. Claude analyzes the request and returns generated content based on its training.

```python
from anthropic import Anthropic

# Initialize client - automatically reads ANTHROPIC_API_KEY from environment
client = Anthropic()  # or pass api_key="your-key-here" explicitly

# Send a prompt and get a response
response = client.messages.create(
    model="claude-sonnet-4-5",  
    max_tokens=1024,  # Maximum response length
    messages=[
        {"role": "user", "content": "Write a Python function that sorts a list of dictionaries by a specific key."}
    ]
)

# Extract and print the response
print(response.content[0].text)
```

**What happens:**
1. The `Anthropic()` client connects to Claude's API using your API key
2. `messages.create()` sends your prompt to the model
3. Claude processes your request and generates a response
4. The response is stored in `response.content[0].text`

**With System Prompt:**
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

**Using cURL (Raw API):**
For integrations without SDKs, you can use the raw REST API:

```bash
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude"}
    ]
  }'
```

**Resources:**
- [Claude API Overview](https://platform.claude.com/docs/en/api/overview)
- [Models List](https://platform.claude.com/docs/en/api/models-list) - Check latest available models
- [Working with Messages](https://platform.claude.com/docs/en/build-with-claude/working-with-messages)
- [Features Overview](https://platform.claude.com/docs/en/build-with-claude/overview) - Caching, vision, tool use, streaming, etc.

### ChatGPT (OpenAI)

**Prerequisites:**
- Create an account at [OpenAI Platform](https://platform.openai.com/)
- Go to [API Keys](https://platform.openai.com/account/api-keys) and create a new secret key
- Set environment variable: `export OPENAI_API_KEY="your-key-here"` (or add to `.env` file)
- Check available models at [OpenAI Models](https://platform.openai.com/docs/models)

**Setup:**
```bash
pip install openai
```

**Basic Example:**
This example sends a simple prompt to ChatGPT and retrieves the response. The model analyzes the request and returns generated content.

```python
from openai import OpenAI

# Initialize client - reads OPENAI_API_KEY from environment
client = OpenAI(api_key="your-api-key-here")  # or omit to use env variable

# Send a prompt and get a response
response = client.chat.completions.create(
    model="gpt-4o-mini", 
    messages=[
        {"role": "user", "content": "Write a JavaScript function that filters an array for duplicates."}
    ]
)

# Extract and print the assistant's response
print(response.choices[0].message.content)
```

**What happens:**
1. The `OpenAI` client connects to OpenAI's API
2. `messages` array contains the conversation (role: 'user' or 'assistant')
3. The model generates a response based on your prompt
4. The response is stored in `response.choices[0].message.content`

**With System Prompt:**
System prompts set the model's behavior and expertise level. Use this to guide the tone and type of responses.

```python
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "system",
            "content": "You are a senior software architect. Suggest scalable solutions and explain trade-offs."
        },
        {
            "role": "user",
            "content": "Design a microservices architecture for an e-commerce platform."
        }
    ]
)

print(response.choices[0].message.content)
```

**Resources:**
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Chat Completions Guide](https://platform.openai.com/docs/guides/chat)
- [Models Overview](https://platform.openai.com/docs/models)

### Gemini (Google)

**Prerequisites:**
- Create a Google account if you don't have one
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create a new API key
- Set environment variable: `export GOOGLE_API_KEY="your-key-here"` (or add to `.env` file)
- Note: Gemini API offers free tier with usage limits

**Setup:**
```bash
pip install google-generativeai
```

**Basic Example:**
This example initializes the Gemini model and sends a prompt to generate content. It's particularly good for creative writing and detailed explanations.

```python
import google.generativeai as genai

# Configure the API with your key (reads GOOGLE_API_KEY from environment if available)
genai.configure(api_key="your-api-key-here")  # or omit to use env variable

# Select the model to use
model = genai.GenerativeModel('gemini-pro')

# Send a prompt and generate content
response = model.generate_content(
    "Write a Python function that sorts a list of dictionaries by a specific key."
)

# Print the generated response
print(response.text)
```

**What happens:**
1. The `genai.configure()` sets up authentication with your API key
2. `GenerativeModel()` initializes the Gemini model
3. `generate_content()` sends your prompt and generates a response
4. The response text is accessed via `response.text`

**With System Prompt (System Instruction):**
System instructions guide how Gemini responds. This is useful for setting tone, expertise level, and response format expectations.

```python
# Create model with system instructions
model = genai.GenerativeModel(
    model_name='gemini-pro',
    system_instruction="You are an expert Python developer. Always provide clean, well-documented code with type hints. Include docstrings for all functions."
)

# Send a prompt with these instructions in mind
response = model.generate_content(
    "Write a function to validate email addresses."
)

print(response.text)
```

**Streaming Response (Real-time output):**
Stream responses as they're being generated, useful for long outputs or real-time feedback:

```python
model = genai.GenerativeModel('gemini-pro')

# Enable streaming to see output in real-time
response = model.generate_content(
    "Explain machine learning in 500 words.",
    stream=True
)

# Process output as it arrives
for chunk in response:
    print(chunk.text, end='', flush=True)
```

**Resources:**
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Documentation](https://ai.google.dev/)
- [Getting Started Guide](https://ai.google.dev/tutorials/python_quickstart)
- [Model Parameters Guide](https://ai.google.dev/docs/concepts#model_parameters)

## How to Prompt Through APIs

### Best Practices

1. **Include Clear Instructions** - Be specific about output format, language, and requirements
2. **Add Context** - Provide relevant code snippets or requirements
3. **Set a Role** - Tell the model what expertise to assume
4. **Use Delimiters** - Separate different sections of your prompt with clear markers
5. **Handle Errors** - Implement try-catch blocks for API failures

### Temperature and Parameters

Adjust model behavior with these parameters:

```python
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    temperature=0.7,  # 0 = deterministic, 1 = creative
    messages=[...]
)
```

- **temperature**: Controls randomness (0-1). Lower = more focused and deterministic, higher = more creative and random. Use 0 for consistent outputs, 0.7-0.9 for balanced creativity
- **max_tokens**: Maximum length of response in tokens (roughly 4 characters per token)
- **top_p**: Nucleus sampling for diversity - lower values = more focused, higher = more diverse
- **top_k**: Only sample from the k most likely tokens (alternative to temperature)
