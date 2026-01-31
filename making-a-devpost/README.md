# Writing a Devpost

In this HackPack, we will cover how to create and enter a **strong** Devpost submission for your IC Hack project!

The goal is simple:
>Make it *easy* for judges to **understand** your project, your **technical depth**, and **why it matters**, in under a few minutes.

Before even starting a Devpost, make sure you have the following:

- A project name (short, memorable)
- A 1-sentence elevator pitch
- A working demo (even if scrappy)
- A GitHub repo
- A short demo video (2-3 mins)

> [!IMPORTANT]
> A project that ***works a bit*** but is *well-explained* scores higher than a complex project nobody understands.

## Table of Contents

<!-- TOC -->

- [Writing a Devpost](#writing-a-devpost)
  - [Table of Contents](#table-of-contents)
  - [What is Devpost?](#what-is-devpost)
  - [Create Your Devpost Project](#create-your-devpost-project)
  - [Project Name \& Tagline](#project-name--tagline)
    - [Project Name](#project-name)
    - [Tagline](#tagline)
  - [Project Description](#project-description)
    - [Problem](#problem)
    - [Solution](#solution)
  - [How It Works](#how-it-works)
  - [Challenges](#challenges)
  - [Learnings \& Accomplishments](#learnings--accomplishments)
  - [What's Next](#whats-next)
  - [Demo Video](#demo-video)
    - [Video Rules](#video-rules)
    - [Suggested Structure](#suggested-structure)
  - [Tech Stack](#tech-stack)
  - [GitHub Repo](#github-repo)
  - [Common Mistakes](#common-mistakes)
  - [Judge Mindset](#judge-mindset)
  - [Past Examples](#past-examples)
  - [Final Check](#final-check)

<!-- /TOC -->

## What is Devpost?

[*Devpost*](https://devpost.com/) is the platform used to submit your IC Hack project. When reading through your Devpost, judges tend to:

- Skim your title & tagline
- Read your description
- Look at your demo
- Look at the tech stack & challenges

> [!CAUTION]
> The judges will most likely ***not*** have the time to review your entire GitHub repo!

This makes it very important for you to have a strong Devpost submission.

Your Devpost entry should tell a **clear** story of:

1. The problem
2. Your solution
3. How it works
4. Why it is impressive

Additionally, adding **screenshots** or a **demo video** gives judges a clear visual of your project.

## Create Your Devpost Project

1. Navigate to the **Devpost hackathon link** provided on the [IC Hack internal page](https://my.ichack.org/). This is likely to be [ic-hack-26.devpost.com](https://ic-hack-26.devpost.com/).
2. Join the IC Hack 26 Devpost by clicking the large "*Join hackathon*" button.
3. Click "*Start project*".
4. Fill in all the information about your project you want to convey, using the advice given below.
5. At some point before the 12:00 PM deadline, find the **public URL** for your Devpost submission and paste this into the relevant box on the internal page.
6. When you are satisfied with your Devpost, continue to the *Submit* step and click "*Submit project*".

> [!NOTE]
> Only one person needs to submit the Devpost project! Just make sure you have formed a team on the internal page.

## Project Name & Tagline

### Project Name

Keep it:

- Short (1-2 words if possible)
- Pronounceable
- Relevant to your project

---

**Good**:

- `Pulse`
- `QuickSplit`
- `AutoNote`

**Bad**:

- `AI_Blockchain_Web3_Thing`
- `NextGenBlockChainAIRevolutionPlatform`
- `Causalitree` - capitalisation of `Tree` would make it simpler to read

---

### Tagline

This is pretty much the ***first*** thing judges will read.

This should take the structure of:
`Verb + what it does (+ for whom)`

Below are some examples of informative, but still concise taglines.

- "*Real-time sign language translation using computer vision*"
- "*Automatically generate revision notes from lecture slides*"

> [!TIP]
> If a judge reads ***only*** your tagline, they should still understand your idea.

## Project Description

This is the section that sets apart winners from runners-up.

### Problem

- What problem are you solving?
- Who does it affect?
- Why does it matter *now*?

Keep it precise (but also don't get too technical just yet).

**Bad**: "People struggle with productivity"

**Good**: "Students waste time manually organising revision notes across multiple platforms"

---

### Solution

- What did you build?
- How does it solve the problem?
- What makes it different?

Mention **key features**, not implementation details (this belongs in the next section).

## How It Works

This is where the more technically-impressive projects can shine through.

Include:

- Architecture overview
- APIs, models and systems used
- Data flow (high-level)

**Example**:

>"We use a React frontend that communicates with a FastAPI backend. User input is processed by a fine-tuned Whisper model, then stored in Firebase and visualised in real time."

> [!IMPORTANT]
> Do not dump code or go too low-level. Explain high-level design choices instead!

## Challenges

Talk about:

- What broke
- What you had to redesign
- Trade-offs you made

Judges tend to *love* this
(it's usually one of the first follow-up questions they ask!), because it proves that

- You actually built it
- You understand your system

## Learnings & Accomplishments

Briefly highlight what makes your project stand out and what you learned while building it. Focus on one meaningful achievement or challenge, and explain what they taught you.

This could include solving a tricky technical problem, integrating an unfamiliar technnology, or improving performance or reliability. Keep it concise, the goal is to show growth without going into deep implementation detail.

**Example**:

>"While debugging the real-time video pipeline, we learned the importance of asynchronous processing and managing memory effectively. This also highlighted the value of designing modular components for easier testing."

## What's Next

Outline realistic next steps for your project. This could include:

- New features that build on current work
- Performance or UX improvements
- Preparing the project for deployment
- Research or experimentation you would like to explore further

Perhaps you could link these to the challenges you faced.

**Example**:

>"Next, we plan to implement a caching system to reduce latency, building on lessons learned from our initial video streaming bottlenecks."

## Demo Video

### Video Rules

- 2-3 minutes
- Screen recording with voice
- Show the product *working*

### Suggested Structure

- Problem (15s)
- Demo (1-2 min)
- Highlight of standout features (30s)

> [!TIP]
> Make your project obvious in the first 60 seconds.

For recording, tools like **OBS**, **Loom**, or the built-in screen recorder on your OS work well.

Upload your video to YouTube as an **unlisted video** for easy embedding.

## Tech Stack

Be honest, don't list things you barely touched!

## GitHub Repo

Ensure:

- The repo is public
- You have a `README` that explains how to run your project
- No API keys are committed

Useful:

- Add UI screenshots to the `README`
- Architecture diagrams

## Common Mistakes

- **Vague problem description**: "We wanted to help people" doesn't tell judges anything
- **Buzzwords without explanation**: Saying "AI-powered" means nothing if you don't explain *how*
- **Overclaiming features**: Only list what actually works; judges will test it
- **Wall of text**: Use bullet points, headers, and whitespace
- **No visuals**: Screenshots and diagrams make your project tangible

## Judge Mindset

Judges are:

- Speed-reading dozens of submissions
- Looking for projects that *clearly* explain their value
- Checking if your demo actually works

Help them by being:

- **Clear** — No jargon without explanation
- **Structured** — Easy to skim with headers and bullets
- **Honest** — Acknowledge limitations; it shows maturity

*But remember...*

**You are here to win your category** *(... and have fun)*!

Tailor your submission to your categories!
For general categories, you will want to target your category in the ***Problem*** section, since the vast majority involve creating a product for a certain demographic or to address a specific scenario.

For 'Best Use Of' categories, you will want to state the technology in your ***Tech Stack***, but also you will want to be explicit in how you have used that technology in your ***How it Works*** section.

*Some* categories fit neither of the two above. For example, at ICHack 25, JetBrains' category was a **no-code approach to learning**. This would be best prioritised in the ***Solution*** section.

## Past Examples

Take a [look here](https://ic-hack-25.devpost.com/project-gallery) for last years' Devpost submissions.

>[!TIP]
>Look out for the `Winner` banner, these are the winners or runners-up of a category. They likely did something right in their Devpost!

## Final Check

- **Name + Tagline:** Instantly understandable in one read
- **Problem:** Specific, real and relevant
- **Solution:** What you built
- **How it Works:** High-level architecture
- **Challenges:** What broke, trade-offs, redesigns
- **Learnings & Accomplishments:** 1 key achievement + takeaway
- **What's Next:** Realistic next steps
- **Tech Stack:** Only what you actually used
- **Demo Video:** Shows the product working

- **Easy to skim**
- **Honest**
- **Value of project immediately clear**

---

**Good luck**—and remember: ***presentation is part of engineering!***
