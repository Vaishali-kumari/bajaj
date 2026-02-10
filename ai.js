const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY environment variable");
}

const ai = new GoogleGenerativeAI(API_KEY);

async function askGemini(prompt) {
  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction:
      "You are a concise assistant. Respond with exactly one word. No punctuation, no sentences."
  });

  try {
    const result = await model.generateContent(
      prompt + " (One word only)"
    );
    const response = await result.response;
    const text = response.text().trim();
    const word = text.split(/\s+/)[0].replace(/[^a-zA-Z0-9]/g, "");
    return word || "Unknown";
  } catch (error) {
    console.error("AI Error:", error.message);
    throw new Error("AI Error");
  }
}

module.exports = { askGemini };
