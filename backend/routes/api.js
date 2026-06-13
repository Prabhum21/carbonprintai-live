import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { calcScore } from '../utils/carbonCalculator.js';
import { z } from 'zod';

dotenv.config();

const router = express.Router();

const calculateSchema = z.object({
  transport: z.string().trim(),
  electricity: z.union([z.string(), z.number()]),
  food: z.string().trim(),
  waste: z.string().trim(),
  query: z.string().trim().optional()
});

// ─────────────────────────────────────────
// Gemini Model Auto-Selector
// Tries models in priority order until one works
// ─────────────────────────────────────────
const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.0-pro',
  'gemini-pro',
];

/**
 * Calls the Gemini API with a given prompt, falling back through multiple models if needed.
 * @param {string} prompt - The prompt to send to Gemini.
 * @returns {Promise<string>} The text response from Gemini.
 * @throws {Error} If all models fail.
 */
async function callGemini(prompt) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  let lastError = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`[Gemini] Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      console.log(`[Gemini] ✅ Success with model: ${modelName}`);
      return result.response.text();
    } catch (err) {
      console.warn(`[Gemini] ❌ ${modelName} failed: ${err.message.slice(0, 80)}`);
      lastError = err;
    }
  }

  // All models failed
  throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
}

// ─────────────────────────────────────────
// Carbon Score Calculation Logic
// ─────────────────────────────────────────
// ─────────────────────────────────────────
// Carbon Score Calculation Logic extracted to utils
// ─────────────────────────────────────────

// ─────────────────────────────────────────
// POST /api/calculate
// ─────────────────────────────────────────
router.post('/calculate', (req, res) => {
  try {
    const { transport, electricity, food, waste } = calculateSchema.parse(req.body);
    const score = calcScore({ transport, electricity, food, waste });
    res.json({ score });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input parameters' });
  }
});

// ─────────────────────────────────────────
// POST /api/advisor  ← REAL GEMINI AI
// Body: { transport, electricity, food, waste }
// Returns: { summary, tips[], weeklyPlan[] }
// ─────────────────────────────────────────
router.post('/advisor', async (req, res) => {
  let validatedData;
  try {
    validatedData = calculateSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid input parameters' });
  }
  const { transport, electricity, food, waste, query } = validatedData;
  const score = calcScore({ transport, electricity, food, waste });

  const prompt = query
    ? `You are CarbonWise AI, a sustainability expert. The user asks: "${query}".
       Their current carbon footprint score is ${score}.
       Give a helpful, personalized sustainability response. Be concise and friendly.`
    : `You are CarbonWise AI, a sustainability expert. Analyze this carbon footprint profile:
       - Transport: ${transport || 'not specified'}
       - Monthly Electricity: ${electricity || 0} kWh
       - Food: ${food || 'not specified'}
       - Waste: ${waste || 'medium'}
       - Total Score: ${score}

       Return a JSON object with exactly these fields:
       {
         "summary": "2-3 sentence personalized analysis",
         "tips": ["tip1", "tip2", "tip3", "tip4"],
         "weeklyPlan": [
           "Monday: action",
           "Tuesday: action",
           "Wednesday: action",
           "Thursday: action",
           "Friday: action",
           "Saturday: action",
           "Sunday: action"
         ]
       }
       Return only valid JSON, no markdown.`;

  try {
    const text = await callGemini(prompt);

    // If query mode, return plain text response
    if (query) {
      return res.json({ response: text });
    }

    // Parse structured JSON response
    try {
      const cleaned = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return res.json({ score, ...parsed });
    } catch {
      return res.json({ score, summary: text, tips: [], weeklyPlan: [] });
    }

  } catch (error) {
    console.error('[Gemini] All models failed:', error.message);

    // Smart fallback based on user's actual data
    const transportLabel = transport || 'car';
    const foodLabel = food || 'mixed';
    res.json({
      score,
      summary: `Your carbon score is ${score}. Based on your ${transportLabel} commute and ${foodLabel} diet, you have great potential to reduce your environmental impact with a few lifestyle changes.`,
      tips: [
        `Switch from ${transportLabel} to public transport 2 days a week`,
        'Replace traditional bulbs with LED lighting to cut electricity use by 30%',
        'Reduce meat consumption by trying one plant-based day per week',
        'Start composting kitchen waste to reduce landfill methane emissions',
      ],
      weeklyPlan: [
        'Monday: Use public transport or cycle to work',
        'Tuesday: Reduce electricity — unplug devices when not in use',
        'Wednesday: No single-use plastic day',
        'Thursday: Walk for short trips instead of driving',
        'Friday: Cook a vegetarian meal',
        'Saturday: Plant a tree, herb, or vegetable at home',
        'Sunday: Sort and recycle all your week\'s waste',
      ],
    });
  }
});

export default router;
