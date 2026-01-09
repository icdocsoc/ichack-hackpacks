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

For more complex reasoning tasks, ask the LLM to show its work and though process. 

**Example:**
```txt
A store has 15 apples. They sell 40% and then receive a shipment that doubles 
their remaining stock. How many apples do they have now?

Solve this step by step, showing your calculation at each stage.
```

### Trigger Review

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

## How to prompt through APIs

## Example