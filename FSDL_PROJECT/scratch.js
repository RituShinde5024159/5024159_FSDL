import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

async function run() {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.VITE_GEMINI_API_KEY}`);
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}
run();
