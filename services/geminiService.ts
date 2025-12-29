
import { GoogleGenAI, Modality } from "@google/genai";
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

// Neural Edge Operational Service (High-speed, "local-style" processing)
export const processEdgeOperation = async (task: string, input: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODELS.LITE,
    contents: `Task: ${task}\nInput Data: ${input}`,
    config: {
      systemInstruction: "You are Nova Edge, a high-performance operational node. Your goal is sub-second processing for logistical tasks like tagging, formatting, sentiment analysis, and metadata extraction. Be extremely concise.",
      temperature: 0.1,
    }
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

// Neural Speech Synthesis (TTS)
export const generateSpeech = async (text: string, voiceName: string = 'Kore') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });
  
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Voice synthesis failed.");
  return base64Audio;
};

// Audio Decoding Helpers for Raw PCM from Gemini TTS
export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function playPcmAudio(data: Uint8Array, sampleRate: number = 24000) {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length;
  const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
}

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

// Multimodal Design Analysis
export const analyzeDesignShard = async (imageUrl: string, prompt: string) => {
  const ai = getAI();
  
  // Fetch image bytes
  const imgResponse = await fetch(imageUrl);
  const blob = await imgResponse.blob();
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve) => {
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(blob);
  });
  const base64Data = await base64Promise;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: blob.type } },
        { text: prompt }
      ]
    },
    config: {
      systemInstruction: "You are Nova Architect. You analyze design mockups and provide precise technical feedback, structural component mapping, and accessibility audits. Focus on React and Tailwind CSS implementation strategies."
    }
  });
  return response.text;
};

// Generate reusable React component from design image
export const generateReactComponentFromImage = async (imageUrl: string, componentName: string) => {
  const ai = getAI();
  
  const imgResponse = await fetch(imageUrl);
  const blob = await imgResponse.blob();
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve) => {
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(blob);
  });
  const base64Data = await base64Promise;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: blob.type } },
        { text: `Synthesize a reusable React 19 functional component named "${componentName}" based on this design. 
        Requirements:
        1. Use Tailwind CSS for all styling.
        2. Ensure high fidelity to the layout, colors, and typography shown.
        3. Include appropriate ARIA attributes (role, aria-label, aria-hidden, aria-expanded, etc.) for high accessibility.
        4. Use semantic HTML5 elements.
        5. Return ONLY the code block, no explanations.` }
      ]
    },
    config: {
      systemInstruction: "You are Nova Coder. You transform visual designs into production-grade, accessible React 19 components."
    }
  });
  return response.text;
};

// Generate reusable React component from Figma JSON structure
export const generateReactComponentFromStructure = async (nodeData: any, componentName: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Transform this Figma node structural metadata into a highly optimized, reusable React 19 component named "${componentName}".
    
    Source Metadata:
    ${JSON.stringify(nodeData, null, 2)}
    
    Technical Directive:
    1. Implementation: Use React 19 patterns (functional components, clean prop structures).
    2. Styling: Exclusively use Tailwind CSS. Map Figma values like padding, itemSpacing, layoutMode (flex), colors, and opacity to the closest Tailwind utility classes.
    3. Structural Fidelity: Maintain the hierarchy of frames, components, and groups as nested <div>, <section>, or <article> elements.
    4. Accessibility (A11y): Integrate deep accessibility support. Use semantic HTML5 tags (<button>, <nav>, <header>). Add ARIA roles, aria-labels based on text content, and tabIndex where interactivity is implied.
    5. Icons: If icons are detected in vector data, use Lucide-react or FontAwesome icon components as placeholders.
    6. Code Quality: Return a complete, self-contained TypeScript file content.
    
    Return ONLY the code block.`,
    config: {
      systemInstruction: "You are Nova Coder v4.0. You specialize in transmuting Figma's internal tree structure into pixel-perfect, accessible React production code.",
      temperature: 0.1
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
