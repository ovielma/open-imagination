import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { safeLog, safeError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const { prompt, imageBytes, apiKey: userApiKey } = await request.json();

    if (!prompt || !imageBytes) {
      return NextResponse.json({ error: "Prompt and image are required" }, { status: 400 });
    }

    // Use user-provided API key if available, otherwise fallback to environment variable
    const apiKey = userApiKey || process.env.GOOGLE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: "No API key provided. Please add your Google AI API key in the settings." 
      }, { status: 401 });
    }

    const ai = new GoogleGenAI({ apiKey });

    safeLog("Converting image to video for prompt", { promptLength: prompt.length });

    let operation = await ai.models.generateVideos({
      model: "veo-2.0-generate-001",
      prompt: prompt,
      image: {
        imageBytes: imageBytes,
        mimeType: "image/png",
      },
      config: {
        aspectRatio: "16:9",
        numberOfVideos: 2,
      },
    });

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 60; // 10 minutes max

    while (!operation.done && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
      operation = await ai.operations.getVideosOperation({
        operation: operation,
      });
      attempts++;
      safeLog(`Image-to-video conversion attempt ${attempts}`, { done: operation.done });
    }

    if (!operation.done) {
      return NextResponse.json(
        { error: "Video generation timed out" }, 
        { status: 408 }
      );
    }

    // Fetch video URLs
    const videos = await Promise.all(
      operation.response?.generatedVideos?.map(async (generatedVideo, index) => {
        const videoUri = generatedVideo.video?.uri;
        if (videoUri) {
          const urlWithKey = `${videoUri}&key=${apiKey}`;
          return {
            id: `${Date.now()}-${index}`,
            url: urlWithKey,
            uri: videoUri
          };
        }
        return null;
      }).filter(Boolean) || []
    );

    return NextResponse.json({ 
      success: true, 
      videos,
      prompt 
    });

  } catch (error) {
    safeError("Error converting image to video:", error);
    return NextResponse.json(
      { error: "Failed to convert image to video" }, 
      { status: 500 }
    );
  }
} 