import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

app.post('/api/match', async (req, res) => {
  const { query, filters } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Act as a senior product toxicologist for the app "Alterra". 
  User Search: "${query}" 
  User Preferences: "${filters}"
  
  Provide 3 safer alternatives that are WIDELY AVAILABLE IN THE INDIAN MARKET. 
  You MUST return ONLY a JSON array. 
  Each object MUST have: "id", "name", "brand", "description", "safety_score" (1-10), and "price" (in Indian Rupees, e.g., "₹450").
  Example: [{"id": "1", "name": "Green Tea Toner", "brand": "Plum", "description": "Free of parabens. Easily available on Nykaa.", "safety_score": 9.4, "price": "₹390"}]`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = JSON.parse(text.replace(/```json|```/g, "").trim());
    res.json(cleanJson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI Analysis Failed" });
  }
});

app.listen(5000, () => console.log('🚀 Alterra Backend: http://localhost:5000'));
