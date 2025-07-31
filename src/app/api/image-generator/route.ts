import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { safeLog, safeError } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey: userApiKey } = await request.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      )
    }

    if (prompt.length > 512) {
      return NextResponse.json(
        { error: "Prompt exceeds 512-character limit" },
        { status: 400 }
      )
    }

        // Use user-provided API key if available, otherwise fallback to environment variable
    const apiKey = userApiKey || process.env.GOOGLE_GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required. Please add your Google Gemini API key in settings." },
        { status: 401 }
      )
    }

    const ai = new GoogleGenAI({apiKey});

    safeLog("Generating images for prompt", { promptLength: prompt.length });

    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-preview-06-06",
      prompt: prompt,
      config: {
        numberOfImages: 2,
      }
    });

    // Convert image bytes to base64 data URLs for frontend display
    const images = (response.generatedImages || []).map((generatedImage, index) => {
        const imageBytes = generatedImage.image?.imageBytes;
        if (!imageBytes) return null;
        const base64 = `data:image/png;base64,${imageBytes}`;
        return {
          id: `${Date.now()}-${index}`,
          url: base64,
          imageBytes: imageBytes // Keep for potential video conversion
        };
      }).filter(Boolean);
  
      return NextResponse.json({ 
        success: true, 
        images,
        prompt 
      });
      

  } catch (error) {
    safeError("Image generation failed:", error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unable to generate images"
    }, { status: 500 })
  }
}