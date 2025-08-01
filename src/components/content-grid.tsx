"use client";

import { useState, useEffect } from "react";
import { ImageGrid } from "@/components/image-grid";
import { VideoGrid } from "@/components/video-grid";
import { LoadGrid } from "@/components/load-grid";
import { SettingsModal } from "@/components/settings-modal";
import { ExpandedMediaView } from "@/components/expanded-media-view";
import { motion } from "motion/react";
import { useToast } from "@/hooks/use-toast";
import { safeError } from "@/lib/api-utils";

interface ImageGeneration {
  id: string;
  prompt: string;
  images: Array<{
    url: string;
    imageBytes?: string;
    isSample?: boolean;
  }>;
  timestamp: Date;
  isLoading: boolean;
}

interface VideoGeneration {
  id: string;
  prompt: string;
  videos: string[];
  timestamp: Date;
  isLoading: boolean;
  sourceImage?: string;
}

interface LoadingGeneration {
  id: string;
  prompt: string;
  type: "image" | "video";
  timestamp: Date;
  isLoading: true;
  sourceImage?: string;
}

type Generation = ImageGeneration | VideoGeneration | LoadingGeneration;

// Sample data for demonstration with real generated content
const createSampleGenerations = (): Generation[] => [
  // Video generation (most recent)
  {
    id: "sample-video-1",
    prompt: "A person interacts with OpenAI's AI companion — a screen‑less, voice‑first wearable that clips to the ear and can extend into lightweight glasses to project a subtle AR UI. The device uses contextual awareness to assist with daily tasks, learning, and creativity. Inspired by non‑invasive neural interfaces (no surgery shown).",
    videos: [
      "/sample-videos/ai-device.mp4",
      "/sample-videos/ai-device2.mp4"
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    isLoading: false
  } as VideoGeneration,
  // Video generation (second)
  {
    id: "sample-video-2",
    prompt: "A futuristic human‑made starship (sleek composite hull, blue ion trails, modular cargo rings) arrives at a sprawling orbital space station. The station’s outer concourse features a glowing “Drive‑Thru Coffee”kiosk with tiny service drones passing beverages to cockpit hatches. Planet Mars hangs large and rust‑red in the distance, slowly drifting to show parallax.",
    videos: [
      "/sample-videos/space-coffee-shop.mp4",
      "/sample-videos/space-coffee-shop2.mp4",
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    isLoading: false
  } as VideoGeneration,
  {
    id: "sample-video-3",
    prompt: "A believable autonomous car with subtle cyberpunk design cues (sleek matte body, soft neon edge accents, lidar puck, HUD reflections) passes slowly along a rainy city street (front-of-the-car view). A happy australian cattle dog (blue heeler) sits in the driver seat with the window down, head out, tongue slightly out, ears back, eyes bright.",
    videos: [
      "/sample-videos/av-dog1.mp4",
      "/sample-videos/av-dog2.mp4"
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 2 minutes ago
    isLoading: false
  } as VideoGeneration,
  // Image generation - Neo Austin
  {
    id: "sample-image-av-dog",
    prompt: "A believable autonomous car with subtle cyberpunk design cues (sleek matte body, soft neon edge accents, lidar puck, HUD reflections) passes slowly along a rainy city street (front-of-the-car view). A happy australian cattle dog (blue heeler) sits in the driver seat with the window down, head out, tongue slightly out, ears back, eyes bright.",
    images: [
      { url: "/sample-images/av-dog1.png", isSample: true },
      { url: "/sample-images/av-dog2.png", isSample: true }
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    isLoading: false
  } as ImageGeneration,
  {
    id: "sample-image-1",
    prompt: "A fashion magazine cover where the main title NEO AUSTIN is in a bold, clean font. A beautiful goth girl with a chic short haircut and orange-tinted sunglasses stands confidently in the middle of a deserted Downtown Austin at dawn. She wears an oversized black blazer by afictional brand over a graphic t-shirt and black shorts. On her left hand she is holding a vintage boombox. The headline reads Austin Landscape. Smaller text includes Issue 08, The Future is Now. The artwork is in the style of Nyo, featuring a full-body portrait, character design for games, with high resolution, high details, sharp focus, 2D game art style, anime-inspired characters, hand-drawn watercolors, high detail, high quality, and high definition.",
    images: [
      { url: "/sample-images/neo-austin1.png", isSample: true },
      { url: "/sample-images/neo-austin2.png", isSample: true }
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    isLoading: false
  } as ImageGeneration,
  // Image generation - Spider Jerusalem
  {
    id: "sample-image-2",
    prompt: "Spider Jerusalem, bald, lean, full back tattoos peeking from an open black coat, shirtless, smoking, reflective two‑tone sunglasses (one red, one green). He has a wicked grin, rain‑slick cyberpunk megacity balcony at night, neon signage bokeh, hard rim light + soft fill, 85mm lens shallow depth of field, ultradetailed ink‑and‑wash comic style, gritty texture, dramatic contrast, cinematic. Negative: blurry, low detail, plastic skin, extra fingers, soft focus, watermark.",
    images: [
      { url: "/sample-images/spiderjerusalem1.png", isSample: true },
      { url: "/sample-images/spiderjerusalem2.png", isSample: true }
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    isLoading: false
  } as ImageGeneration
];

export function ContentGrid({ 
  onNewGeneration,
  onImageToVideo 
}: { 
  onNewGeneration?: (handler: (type: "image" | "video", prompt: string) => void) => void;
  onImageToVideo?: (handler: (imageUrl: string, imageBytes: string, prompt: string) => void) => void;
}) {
  const { toast } = useToast();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [focusedView, setFocusedView] = useState<{
    isOpen: boolean;
    mediaItems: Array<{
      id: string;
      type: 'image' | 'video';
      url: string;
      prompt: string;
      timestamp: Date;
      sourceImage?: string;
    }>;
    initialIndex: number;
  }>({ isOpen: false, mediaItems: [], initialIndex: 0 });

  // Initialize with sample data after mount to avoid hydration issues
  useEffect(() => {
    setGenerations(createSampleGenerations());
  }, []);

  // Helper function to gather all media items from generations
  const getAllMediaItems = () => {
    const mediaItems: Array<{
      id: string;
      type: 'image' | 'video';
      url: string;
      prompt: string;
      timestamp: Date;
      sourceImage?: string;
    }> = [];

    generations.forEach((generation) => {
      if (!generation.isLoading) {
        if ('images' in generation) {
          // Image generation
          generation.images.forEach((image, index) => {
            mediaItems.push({
              id: `${generation.id}-img-${index}`,
              type: 'image',
              url: image.url,
              prompt: generation.prompt,
              timestamp: generation.timestamp,
            });
          });
        } else if ('videos' in generation) {
          // Video generation
          generation.videos.forEach((video, index) => {
            mediaItems.push({
              id: `${generation.id}-vid-${index}`,
              type: 'video',
              url: video,
              prompt: generation.prompt,
              timestamp: generation.timestamp,
              sourceImage: generation.sourceImage,
            });
          });
        }
      }
    });

    // Sort by timestamp (newest first)
    return mediaItems.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  // Function to open focused view
  const openFocusedView = (generationId: string, itemIndex: number) => {
    const allMediaItems = getAllMediaItems();
    
    // Find the correct item in the sorted media items array
    // Create the expected item ID based on generation ID and item index
    const generation = generations.find(gen => gen.id === generationId);
    if (!generation || generation.isLoading) return;
    
    let targetItemId: string;
    if ('images' in generation) {
      targetItemId = `${generationId}-img-${itemIndex}`;
    } else {
      targetItemId = `${generationId}-vid-${itemIndex}`;
    }
    
    // Find the index of this item in the sorted media items array
    const globalIndex = allMediaItems.findIndex(item => item.id === targetItemId);
    
    if (globalIndex === -1) {
      safeError('Could not find media item with ID:', targetItemId);
      return;
    }

    setFocusedView({
      isOpen: true,
      mediaItems: allMediaItems,
      initialIndex: globalIndex,
    });
  };

  const handleNewGeneration = async (type: "image" | "video", prompt: string) => {
    // Get user's API key from localStorage
    const userApiKey = sessionStorage.getItem("gemini_api_key");
    
    // Check if user has provided an API key
    if (!userApiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your Google Gemini API key in settings to generate content.",
        variant: "destructive",
      });
      setShowApiKeyDialog(true);
      return;
    }
    
    const loadingGeneration: LoadingGeneration = {
      id: `loading-${Date.now()}`,
      prompt,
      type,
      timestamp: new Date(),
      isLoading: true
    };

    // Add new loading generation at the top
    setGenerations(prev => [loadingGeneration, ...prev]);

    try {
      if (type === "image") {
        // Call Imagen API
        const response = await fetch('/api/image-generator', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt, apiKey: userApiKey }),
        });

        const data = await response.json();

        if (data.success) {
          const completedGeneration: ImageGeneration = {
            id: loadingGeneration.id,
            prompt: loadingGeneration.prompt,
            images: data.images.map((img: { url: string; imageBytes: string }) => ({
              url: img.url,
              imageBytes: img.imageBytes
            })),
            timestamp: loadingGeneration.timestamp,
            isLoading: false
          };

          setGenerations(prev => prev.map(gen => 
            gen.id === loadingGeneration.id ? completedGeneration : gen
          ));
        } else {
          throw new Error(data.error || 'Image generation failed');
        }
      } else {
        // Call Veo 3 API for text-to-video
        const response = await fetch('/api/video-generator', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt, apiKey: userApiKey }),
        });

        const data = await response.json();

        if (data.success) {
          const completedGeneration: VideoGeneration = {
            id: loadingGeneration.id,
            prompt: loadingGeneration.prompt,
            videos: data.videos.map((vid: { url: string }) => vid.url),
            timestamp: loadingGeneration.timestamp,
            isLoading: false
          };

          setGenerations(prev => prev.map(gen => 
            gen.id === loadingGeneration.id ? completedGeneration : gen
          ));
        } else {
          throw new Error(data.error || 'Video generation failed');
        }
      }
    } catch (error) {
      safeError('Generation failed:', error);
      // Remove the loading generation on error
      setGenerations(prev => prev.filter(gen => gen.id !== loadingGeneration.id));
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Generation failed';
      if (errorMessage.includes('API key')) {
        setShowApiKeyDialog(true);
      } else {
        toast({
          title: "Generation Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  const handleImageToVideo = async (imageUrl: string, imageBytes: string, prompt: string) => {
    // Get user's API key from localStorage
    const userApiKey = sessionStorage.getItem("gemini_api_key");
    
    // Check if user has provided an API key
    if (!userApiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your Google Gemini API key in settings to generate content.",
        variant: "destructive",
      });
      setShowApiKeyDialog(true);
      return;
    }
    
    const loadingGeneration: LoadingGeneration = {
      id: `video-loading-${Date.now()}`,
      prompt: `${prompt} - animated video`,
      type: "video",
      timestamp: new Date(),
      isLoading: true,
      sourceImage: imageUrl
    };

    // Add new loading generation at the top
    setGenerations(prev => [loadingGeneration, ...prev]);

    try {
      const response = await fetch('/api/image-to-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: `${prompt} - animated video`,
          imageBytes,
          apiKey: userApiKey
        }),
      });

      const data = await response.json();

      if (data.success) {
        const completedGeneration: VideoGeneration = {
          id: loadingGeneration.id,
          prompt: loadingGeneration.prompt,
          videos: data.videos.map((vid: { url: string }) => vid.url),
          timestamp: loadingGeneration.timestamp,
          isLoading: false,
          sourceImage: imageUrl
        };

        setGenerations(prev => prev.map(gen => 
          gen.id === loadingGeneration.id ? completedGeneration : gen
        ));
      } else {
        throw new Error(data.error || 'Video conversion failed');
      }
    } catch (error) {
      safeError('Video conversion failed:', error);
      // Remove the loading generation on error
      setGenerations(prev => prev.filter(gen => gen.id !== loadingGeneration.id));
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Video conversion failed';
      if (errorMessage.includes('API key')) {
        setShowApiKeyDialog(true);
      } else {
        toast({
          title: "Video Conversion Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  // Use useEffect to avoid setState during render
  useEffect(() => {
    if (onNewGeneration) {
      onNewGeneration(handleNewGeneration);
    }
    if (onImageToVideo) {
      onImageToVideo(handleImageToVideo);
    }
  }, [onNewGeneration, onImageToVideo]);

  return (
    <>
      <div className="space-y-8">
      {generations.map((generation) => (
        <motion.div
          key={generation.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {generation.isLoading ? (
            <LoadGrid 
              prompt={generation.prompt}
              type={"type" in generation ? generation.type : "image"}
              sourceImage={"sourceImage" in generation ? generation.sourceImage : undefined}
            />
          ) : "images" in generation ? (
            <ImageGrid 
              generation={generation}
              onImageToVideo={handleImageToVideo}
              onViewFullscreen={openFocusedView}
            />
          ) : (
            <VideoGrid 
              generation={generation} 
              onViewFullscreen={openFocusedView}
            />
          )}
        </motion.div>
      ))}
      
      {generations.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium mb-2">Ready to create something amazing?</h3>
          <p className="text-muted-foreground">
            Use the prompt bar above to generate your first image or video.
          </p>
        </div>
      )}
    </div>

      <SettingsModal
        open={showApiKeyDialog}
        onOpenChange={setShowApiKeyDialog}
      />

      <ExpandedMediaView
        isOpen={focusedView.isOpen}
        onClose={() => setFocusedView(prev => ({ ...prev, isOpen: false }))}
        mediaItems={focusedView.mediaItems}
        initialIndex={focusedView.initialIndex}
        onImageToVideo={handleImageToVideo}
      />
    </>
  );
} 