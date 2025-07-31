"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClockIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface ImageGridProps {
  generation: ImageGeneration;
  onImageToVideo?: (imageUrl: string, imageBytes: string, prompt: string) => void;
  onViewFullscreen?: (generationId: string, imageIndex: number) => void;
}

export function ImageGrid({ generation, onImageToVideo, onViewFullscreen }: ImageGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [convertingToVideo, setConvertingToVideo] = useState<number | null>(null);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getFirstSentence = (text: string) => {
    const match = text.match(/^[^.!?]*[.!?]/);
    return match ? match[0].trim() : text.split(' ').slice(0, 15).join(' ') + (text.split(' ').length > 15 ? '...' : '');
  };

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleConvertToVideo = async (imageData: { url: string; imageBytes?: string; isSample?: boolean }, index: number) => {
    if (!onImageToVideo || !imageData.imageBytes || imageData.isSample) {
      console.error('Image to video conversion not available for sample images');
      return;
    }

    try {
      setConvertingToVideo(index);
      
      // Trigger the parent handler to create a new video generation row
      onImageToVideo(imageData.url, imageData.imageBytes, generation.prompt);
      
    } catch (error) {
      console.error('Video conversion failed:', error);
    } finally {
      setConvertingToVideo(null);
    }
  };

  const handleViewFullscreen = (index: number) => {
    if (onViewFullscreen) {
      onViewFullscreen(generation.id, index);
    } else {
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  // Convert images to lightbox format
  const lightboxItems = generation.images.map((imageData, index) => ({
    type: "image" as const,
    url: imageData.url,
    alt: `Generated image ${index + 1} from: ${generation.prompt}`
  }));

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Images grid - left side */}
      <div className="flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {generation.images.map((imageData, index) => (
            <motion.div
              key={index}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              onClick={() => handleViewFullscreen(index)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden aspect-square border-border/50 relative">
                {generation.isLoading ? (
                  <div className="absolute inset-0">
                    <Badge className="w-full h-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                    </Badge>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={imageData.url}
                      alt={`Generated image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover w-full h-full"
                    />
                    
                    {/* Hover overlay */}
                    <motion.div
                      className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                        <div className="flex flex-col gap-1 sm:gap-2">
                        <div className="flex gap-1 sm:gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(imageData.url, index);
                            }}
                            className="h-6 sm:h-7 px-2 sm:px-3 text-xs font-medium flex-1"
                          >
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewFullscreen(index);
                            }}
                            className="h-6 sm:h-7 px-2 sm:px-3 text-xs font-medium flex-1"
                          >
                            Expand
                          </Button>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="w-full">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleConvertToVideo(imageData, index);
                                  }}
                                  disabled={convertingToVideo === index || !imageData.imageBytes || imageData.isSample}
                                  className="h-6 sm:h-7 px-2 sm:px-3 text-xs font-medium w-full"
                                >
                                  {convertingToVideo === index ? 'Converting...' : 'Animate with Veo 2'}
                                </Button>
                              </span>
                            </TooltipTrigger>
                            {(convertingToVideo === index || !imageData.imageBytes || imageData.isSample) && (
                              <TooltipContent side="bottom">
                                <p>
                                  {convertingToVideo === index 
                                    ? 'Currently converting to video...'
                                    : imageData.isSample 
                                    ? "We can't animate sample images, but generate your own to try it out"
                                    : "Image data not available for animation"
                                  }
                                </p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Prompt information - right side */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="lg:sticky lg:top-24">
          <div className="space-y-3">
            {/* Prompt */}
            <div>
              <h3 className="font-medium text-foreground text-lg leading-relaxed">
                {getFirstSentence(generation.prompt)}
              </h3>
            </div>
            
            {/* Format badge */}
            <div>
              <Badge variant="outline" className="text-xs">
                Images
              </Badge>
            </div>
            
            {/* Time generated */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ClockIcon className="w-3 h-3" />
              <span className="whitespace-nowrap">{formatTimeAgo(generation.timestamp)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 