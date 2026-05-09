import { GoogleGenAI, Type } from "@google/genai";

// GEMINI_API_KEY is injected by the platform into the environment
// We use a fallback to empty string and handle it gracefully
const apiKey = "AIzaSyD6M9qlqV1HfB66a5sfBysS0K0B8wZCMYk"; //(window as any).process?.env?.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenAI({ apiKey });

export interface OutfitPart {
  type: string;
  color: string;
  description: string;
}

export interface OutfitResponse {
  advice: string;
  top: OutfitPart;
  bottom: OutfitPart;
  footwear: OutfitPart;
}

export async function generateOutfitRecommendation(prompt: string): Promise<OutfitResponse> {
  const model = "gemini-3-flash-preview";
  
  const response = await genAI.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: `You are an expert fashion stylist. Based on the user's request, suggest a complete outfit. 
    User Request: "${prompt}"
    
    Return the recommendation in JSON format with:
    - advice: A short stylist tip.
    - top: { type, color, description }
    - bottom: { type, color, description }
    - footwear: { type, color, description }` }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          advice: { type: Type.STRING },
          top: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              color: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["type", "color", "description"]
          },
          bottom: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              color: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["type", "color", "description"]
          },
          footwear: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              color: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["type", "color", "description"]
          }
        },
        required: ["advice", "top", "bottom", "footwear"]
      }
    }
  });
   if (!response?.text) {
    throw new Error("No response text from AI");
  }
  return JSON.parse(response?.text);
}
