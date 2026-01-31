# 'Best Use of Hacktron Skills' Challenge

***DISCLAIMER**: Many thanks to the Hacktron team for providing their [hacker guide](https://hacktron.notion.site/IC-Hack-2026-Best-Use-of-Hacktron-Skills-2f3da84ebefe8079bcbff2623217cb0f) to us. Much of the material in this HackPack is adapted from that document.*

## Introduction to Hacktron

**Hacktron** is a cutting-edge AI-powered security platform that brings continuous security scanning and vulnerability detection to both enterprises and individual developers. With the rise of AI-assisted coding, ensuring code security has become more critical than ever.

### What is Hacktron?

Hacktron offers two distinct products:

1. **Enterprise Platform**: Continuous security scanning for organisations that need automated, ongoing security monitoring
2. **Hacktron CLI**: A powerful command-line tool designed for security researchers and developers - think of it as "Claude Code for hackers"

The [Hacktron CLI](https://docs.hacktron.ai/cli/quickstart) is particularly relevant in the era of AI-generated code. As more developers rely on AI coding assistants ("vibe coding"), the importance of verifying that deployed code is free from vulnerabilities has never been greater.

## Getting Your Free Credits

Hacktron is offering IC Hack 2026 participants **1 month of Hacktron Pro for free**!

### Redemption Steps

1. Create your Hacktron account at [https://hacktron.ai](https://hacktron.ai)
2. Follow the [Quickstart Guide](https://docs.hacktron.ai/cli/quickstart) to set up the CLI
3. At checkout, redeem this coupon code:

   ```txt
   ICHACK26-easiest-utmost-perjurer
   ```

4. Enjoy Hacktron Pro with higher usage limits throughout the hackathon!

The Pro account provides significantly higher usage limits, giving you plenty of capacity to build and test your skills throughout IC Hack 2026.

## What Can You Do With Hacktron?

Hacktron CLI is an AI-powered security testing tool that helps you identify vulnerabilities in your codebase. Here are some powerful use cases:

### 1. **Automated Vulnerability Scanning**

Run Hacktron on any codebase - whether you're actively developing it or inheriting legacy code - to identify common security issues:

- SQL injection vulnerabilities
- Cross-Site Scripting (XSS) weaknesses
- Insecure Direct Object References (IDOR)
- Authentication and authorisation flaws
- Cryptographic vulnerabilities
- API security issues

**Examples**:

- Building a web app with user authentication? Hacktron automatically detects if your session management has weaknesses or if sensitive data is being exposed.
- Inherited a Node.js API from another team? Use Hacktron to scan for vulnerabilities and generate a prioritised fix list based on severity.

### 2. **Code Review Automation**

Before committing code or creating a pull request, use Hacktron to:

- Verify that your AI-generated code doesn't contain security flaws
- Check third-party dependencies for known vulnerabilities
- Ensure secure coding practices are followed

**Example**: After using Copilot to generate database queries, run Hacktron to ensure they're properly parameterised and safe from SQL injection.

### 3. **Learning Security Best Practices**

Hacktron is an educational tool that helps you:

- Understand why certain code patterns are vulnerable
- Learn secure alternatives to risky implementations
- Build security awareness as you develop

**Example**: Write intentionally vulnerable code as a learning exercise, then use Hacktron to identify the issues and understand the proper fixes.

### 4. **CTF and Security Challenges**

Perfect for Capture The Flag competitions:

- Identify potential attack vectors in challenge applications
- Analyse web applications for exploitable vulnerabilities
- Practice penetration testing skills in a controlled environment

**Example**: Competing in a web security CTF? Use Hacktron to enumerate vulnerabilities and find the path to capture flags.

## The Challenge: Hacktron Skills

For this IC Hack challenge, you'll work on **Hacktron Skills** - modular, open-source extensions that enhance Hacktron's capabilities.

### What Are Hacktron Skills?

Hacktron Skills are specialised extensions that provide:

- Domain-specific security instructions
- Custom scripts and tools
- Reference materials for complex security tasks
- Integration with security testing workflows

Each skill follows the [Agent Skills specification](https://agentskills.io/specification), making them portable and standardised.

### Working with Environments

Hacktron Skills work best with **environments** - containerised applications that can be tested for vulnerabilities. If you're unfamiliar with containerisation, check out [our HackPack on Docker](/docker/README.md)!

Once you are, setting up an environment is fairly straightforward:

1. **Dockerise your application** so it can be spun up with `docker-compose up -d`
2. **Define an objective** through a hidden *flag* (a piece of text that can only be accessed when the objective is met)

**Example Objectives:**

- Hide a flag in a user's account to test for IDOR issues
- Hide a flag in the database to test for SQL injection
- Hide a flag in the filesystem to test for remote code execution

Check out this [example environment](https://github.com/HacktronAI/skills/tree/main/environments/vercel-waf-env) for reference.

## Skill Development

### Setup

Skills must be located in the `~/.hacktron/skills/` directory on your machine for security reasons (skills can execute arbitrary commands).

Verify Hacktron detects your skill:

```bash
hacktron skills list
```

### Skill Ideas

Here are some project ideas to get you started:

#### 1. **Code Deobfuscation & Decompilation Skill**

- **Skill**: Makes obfuscated or compiled code readable for security analysis
  - Fetches and beautifies minified JavaScript from URLs (webpack, React bundles, etc.)
  - Decompiles Electron applications or Android APKs
  - Performs source-to-sink analysis to identify vulnerabilities
- **Use cases**:
  - Analysing production web apps where source code isn't available
  - Security auditing of mobile and desktop applications
  - Client-side XSS vulnerability detection

#### 2. **Vulnerability Validation Skill**

- **Skill**: Parses JSON or [SARIF output](https://semgrep.dev/docs/semgrep-appsec-platform/json-and-sarif) from security scanners (like Semgrep)
- **Validates findings** through static analysis and dynamic testing
- **Use case**: Reducing false positives from automated security tools

#### 3. **Custom Payloads for Specific Frameworks**

- **Skill**: Generates framework-specific exploit payloads (Django, Express, Flask, etc.)
- **Use case**: Testing web applications built with specific frameworks

...or anything else you think would be valuable to the security community!

## Resources

- [Hacktron Documentation](https://docs.hacktron.ai/)
- [Hacktron CLI Quickstart](https://docs.hacktron.ai/cli/quickstart)
- [Agent Skills Specification](https://agentskills.io/specification)
- [Hacktron Skills Repository](https://github.com/HacktronAI/skills)
- [Trail of Bits Skills](https://github.com/trailofbits/skills) (compatible with Hacktron)
- [Hacktron Dynamic Agent Discovery](https://docs.hacktron.ai/cli/agents)

## Contributing Your Skills

Once you've built your skill, contribute it back to the community:

1. Test your skill thoroughly with Hacktron
2. Document your skill with clear usage instructions
3. Raise a pull request to the [Hacktron skills repository](https://github.com/HacktronAI/skills)

Your contribution could help security researchers and developers worldwide!

## Need Help?

- Check the [Hacktron documentation](https://docs.hacktron.ai/)
- Review existing skills in the [skills repository](https://github.com/HacktronAI/skills) for examples
- Ask the Hacktron team at the hackathon

---

Good luck, and happy hacking! 🔒
