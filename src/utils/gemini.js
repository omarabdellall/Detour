import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-2.5-flash";

export async function generateAiOverview({ preferences, activities }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || activities.length === 0) {
    return null;
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: MODEL_NAME });

    const prompt = [
      "You are helping college students plan authentic city experiences.",
      "Write 2 short sentences, friendly and practical.",
      "Mention why the chosen plan matches their vibe and constraints.",
      "Do not use bullet points.",
      "",
      `City: ${preferences.city || "Unknown"}`,
      `Vibe: ${preferences.vibes.join(", ") || "Not specified"}`,
      `Budget: ${preferences.budget || "Not specified"}`,
      `Time: ${preferences.time || "Not specified"}`,
      `Group: ${preferences.group || "Not specified"}`,
      `Selected stops: ${activities.map((activity) => activity.title).join(", ")}`,
    ].join("\n");

    const response = await model.generateContent(prompt);
    const text = response.response.text().trim();
    return text.length > 0 ? text : null;
  } catch {
    return null;
  }
}
