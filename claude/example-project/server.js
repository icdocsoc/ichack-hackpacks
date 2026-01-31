
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve files from the 'public' folder

// THE ENDPOINT
// Returns the result of a fixed Claude API call
app.get('/api/result', async (req, res) => {
    try {
        // Check for API Key
        if (!process.env.ANTHROPIC_API_KEY) {
            return res.status(500).json({ 
                error: 'Server missing API Key. Set ANTHROPIC_API_KEY in .env file.' 
            });
        }

        // Send to Anthropic
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

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Send back the text response
        res.json({ 
            result: data.content[0].text 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});