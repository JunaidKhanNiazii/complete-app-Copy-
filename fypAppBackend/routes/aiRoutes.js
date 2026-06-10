const express = require('express');
const router = express.Router();
const axios = require('axios');

const GROQ_API_KEY = process.env.groqApi;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const { retrieveExercises } = require('../services/ragHelper');
const { getUserContext } = require('../services/personalizationService');
const { buildPersonalizedSystemPrompt } = require('../services/promptBuilder');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../ai-debug.log');

function logToFile(title, content) {
    const timestamp = new Date().toISOString();
    const entry = `\n[${timestamp}] === ${title} ===\n${typeof content === 'string' ? content : JSON.stringify(content, null, 2)}\n`;
    fs.appendFileSync(logFile, entry);
}

/**
 * Chat with AI fitness assistant (Personalized Version)
 */
router.post('/chat', async (req, res) => {
    try {
        const { message, conversationHistory = [], userId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!GROQ_API_KEY) {
            return res.status(500).json({ error: 'Groq API key not configured' });
        }

        // --- STEP 1: RAG Retrieval ---
        console.log(`[AI Chat] Processing query: "${message}"`);
        const retrievedExercises = await retrieveExercises(message, userId);
        console.log(`[AI Chat] Retrieved ${retrievedExercises.length} context documents`);

        // --- STEP 2: User Personalization ---
        const userContext = await getUserContext(userId);
        console.log(`[AI Chat] User Context: ${userContext.userName} (${userContext.experienceLevel})`);

        // --- STEP 3: Build Personalized System Prompt ---
        const systemPromptContent = buildPersonalizedSystemPrompt(userContext, retrievedExercises);

        const systemPrompt = {
            role: 'system',
            content: systemPromptContent
        };

        const messages = [
            systemPrompt,
            ...conversationHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            })),
            {
                role: 'user',
                content: message
            }
        ];

        logToFile('AI REQUEST START', {
            userId,
            userName: userContext.userName,
            query: message,
            systemPrompt: systemPromptContent
        });

        // Call Groq API
        const response = await axios.post(
            GROQ_API_URL,
            {
                model: 'llama-3.3-70b-versatile',
                messages: messages,
                temperature: 0.7,
                max_tokens: 500,
                top_p: 0.9
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const aiResponse = response.data.choices[0].message.content;

        logToFile('AI RESPONSE', aiResponse);

        res.json({
            success: true,
            response: aiResponse,
            model: 'llama-3.3-70b-versatile',
            personalization: {
                user: userContext.userName,
                level: userContext.experienceLevel,
                contextSize: retrievedExercises.length
            }
        });

    } catch (error) {
        console.error('AI chat error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to get AI response',
            details: error.response?.data?.error?.message || error.message
        });
    }
});

module.exports = router;
