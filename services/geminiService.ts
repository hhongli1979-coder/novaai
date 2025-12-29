
import { GoogleGenAI } from "@google/genai";
import { MODELS } from "../constants";

// Initialize GoogleGenAI using the mandatory apiKey structure from process.env.API_KEY.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Chat with Gemini maintaining history and Nova's system persona.
export const chatWithGemini = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODELS.TEXT,
    contents: history.concat([{ role: 'user', parts: [{ text: message }] }]),
    config: {
      systemInstruction: `You are Nova, an autonomous creative engine. 
      You are the core of Nova Creative Suite. You excel at:
      1. Advanced UI/UX Architecture (React, Tailwind)
      2. 3D Commerce Strategy (AR/VR Storefronts)
      3. Marketing Content Automation
      Always provide precise, professional, and innovative solutions.`,
      temperature: 0.8,
    },
  });
  return response.text;
};

// Neural Translation Service
export const translateText = async (text: string, targetLang: string, tone: string = 'professional') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODELS.TEXT,
    contents: `Translate the following text to ${targetLang}. 
    Maintain a ${tone} tone. 
    Ensure cultural nuances and creative context are preserved.
    
    Text to translate:
    "${text}"`,
    config: {
      systemInstruction: "You are the Nova Neural Translation module. You specialize in high-fidelity, context-aware linguistic mapping.",
      temperature: 0.3,
    }
  });
  return response.text;
};

// Analyze AR Spatial Scene using Gemini Vision
export const analyzeSpatialScene = async (base64Image: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODELS.TEXT, 
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image.split(',')[1]
          }
        },
        {
          text: "Analyze this room for AR product placement. Identify surfaces, lighting conditions, and suggest the best spot to place a high-end consumer electronic product for maximum aesthetic appeal. Keep the response concise and technical."
        }
      ]
    },
    config: {
      systemInstruction: "You are the Nova Spatial Intelligence module. You provide rapid environmental analysis for AR commerce."
    }
  });
  return response.text;
};

// Generate image using Gemini models.
export const generateImageWithGemini = async (prompt: string, options?: any) => {
  const ai = getAI();
  let isPro = false;
  let aspectRatio: "1:1" | "16:9" | "9:16" = "1:1";

  if (typeof options === 'boolean') {
    isPro = options;
  } else if (typeof options === 'string') {
    aspectRatio = options as any;
  }

  const model = isPro ? MODELS.IMAGE_PRO : MODELS.IMAGE;
  const response = await ai.models.generateContent({
    model: model,
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: isPro ? "1K" : undefined
      }
    }
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (parts) {
    for (const part of parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }
  throw new Error("Failed to forge pixels.");
};

// Cinematic video generation using Veo models with dynamic resolution and aspect ratio.
export const generateVideoWithVeo = async (
  prompt: string, 
  resolution: '720p' | '1080p', 
  aspectRatio: '16:9' | '9:16', 
  onProgress: (msg: string) => void
) => {
  const ai = getAI();
  onProgress("Initializing cinematic engine...");
  
  let operation = await ai.models.generateVideos({
    model: MODELS.VIDEO,
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: resolution,
      aspectRatio: aspectRatio
    }
  });
  
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed.");
  return `${downloadLink}&key=${process.env.API_KEY}`;
};
