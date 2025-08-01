"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SettingsModal } from "@/components/settings-modal"
import { Settings, ImageIcon, Video } from "lucide-react"

interface PromptBarProps {
  onGenerate?: (type: "image" | "video", prompt: string) => void
  isGenerating?: boolean
}

export function PromptBar({
  onGenerate,
  isGenerating = false
}: PromptBarProps) {
  const [prompt, setPrompt] = useState("")
  const CHAR_LIMIT = 2000;
  const WARN_THRESHOLD = 1950;
  const [generationMode, setGenerationMode] = useState<"image" | "video">("image")
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  const showRainbow = !isGenerating
  
  const handlePromptChange = (value: string) => {
    if (value.length > CHAR_LIMIT) return;
    setPrompt(value)
    setIsTyping(true)
    // Clear typing state after a short delay to prevent constant typing
    setTimeout(() => setIsTyping(false), 1000)
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Support multiple key variations for mobile devices
    const submitKeys = ['Enter', 'Return', 'Go', 'Done', 'Send'];
    const isSubmitKey = submitKeys.includes(e.key);
    
    if (isSubmitKey && !e.shiftKey && prompt.trim() && onGenerate) {
      e.preventDefault()
      onGenerate(generationMode, prompt.trim())
    }
  }
  
  const handleGenerate = () => {
    if (prompt.trim() && onGenerate && prompt.length <= CHAR_LIMIT) {
      onGenerate(generationMode, prompt.trim())
    }
  }
  
  return (
    <>
      {/* Desktop Layout - Horizontal */}
      <div className="w-full py-4">
        <div className="container mx-auto px-4">
                <div className="hidden md:flex items-center gap-6 w-full">
                {/* Logo */}
                <div className="flex items-center flex-shrink-0">
                  <Image
                    src="/OpenImagination-logo.png"
                    alt="OpenImagination"
                    width={200}
                    height={40}
                    className="h-10 w-auto dark:invert"
                    priority
                    sizes="(max-width: 640px) 150px, (max-width: 768px) 200px, (max-width: 1024px) 250px, 300px"
                  />
                </div>
                {/* Center Input Bar - Made as wide as possible */}
                <div className="flex-1 max-w-4xl mx-auto">
                    <motion.div 
                    className="relative p-[2px] rounded-lg"
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    animate={{
                        background: showRainbow 
                        ? [
                            'linear-gradient(45deg, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #0000ff, #7700ff, #ff0077, #ff0000)',
                            'linear-gradient(90deg, #ff7700, #ffff00, #00ff00, #0077ff, #0000ff, #7700ff, #ff0077, #ff0000, #ff7700)',
                            'linear-gradient(135deg, #ffff00, #00ff00, #0077ff, #0000ff, #7700ff, #ff0077, #ff0000, #ff7700, #ffff00)',
                            'linear-gradient(180deg, #00ff00, #0077ff, #0000ff, #7700ff, #ff0077, #ff0000, #ff7700, #ffff00, #00ff00)',
                            'linear-gradient(225deg, #0077ff, #0000ff, #7700ff, #ff0077, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff)',
                            'linear-gradient(270deg, #0000ff, #7700ff, #ff0077, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #0000ff)',
                            'linear-gradient(315deg, #7700ff, #ff0077, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #0000ff, #7700ff)',
                            'linear-gradient(360deg, #ff0077, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #0000ff, #7700ff, #ff0077)'
                            ]
                        : 'transparent'
                    }}
                    transition={{
                        duration: showRainbow ? 3 : 0.3,
                        repeat: showRainbow ? Infinity : 0,
                        ease: "linear"
                    }}
                    >
                    <Input
                        placeholder="Describe your imagination to begin creating..."
                        value={prompt}
                        maxLength={CHAR_LIMIT}
                        onChange={(e) => handlePromptChange(e.target.value)}
                        onKeyUp={handleKeyPress}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={isGenerating}
                        className="w-full bg-muted border-0 placeholder-muted-foreground pr-32 h-12 text-sm overflow-x-auto rounded-md"
                        style={{
                        textOverflow: 'clip',
                        whiteSpace: 'nowrap'
                        }}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1 bg-muted pl-2">
                        <Button
                        size="sm"
                        variant={generationMode === "image" ? "default" : "ghost"}
                        onClick={() => setGenerationMode("image")}
                        disabled={isGenerating}
                        className={`h-8 px-3 text-xs ${
                            generationMode === "image"
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                        >
                        <ImageIcon className="h-3 w-3 mr-1" />
                        Image
                        </Button>
                        <Button
                        size="sm"
                        variant={generationMode === "video" ? "default" : "ghost"}
                        onClick={() => setGenerationMode("video")}
                        disabled={isGenerating}
                        className={`h-8 px-3 text-xs ${
                            generationMode === "video"
                            ? "bg-pink-600 hover:bg-pink-700 text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                        >
                        <Video className="h-3 w-3 mr-1" />
                        Video
                        </Button>
                    </div>
                    
                    </motion.div>
                </div>

                {/* Settings */}
                <div className="flex items-center flex-shrink-0">
                    <Button
                    variant="ghost"
                    size="sm"
                        onClick={() => setShowSettings(true)}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                    <Settings className="h-5 w-5" />
                    </Button>
                </div>
                </div>
            </div>
        </div>
      {/* Mobile Layout - Vertical Stack */}
      <div className="md:hidden space-y-4 w-full">
        {/* Logo at top */}
        <div className="flex justify-center">
          <Image
            src="/OpenImagination-logo.png"
            alt="OpenImagination"
            width={180}
            height={36}
            className="h-9 w-auto dark:invert"
            priority
            sizes="180px"
          />
        </div>
        {/* Input bar */}
        <motion.div 
          className="relative p-[2px] rounded-lg"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          animate={{
            background: showRainbow 
              ? [
                  'linear-gradient(45deg, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #0000ff, #7700ff, #ff0077, #ff0000)',
                  'linear-gradient(90deg, #ff7700, #ffff00, #00ff00, #0077ff, #0000ff, #7700ff, #ff0077, #ff0000, #ff7700)',
                  'linear-gradient(135deg, #ffff00, #00ff00, #0077ff, #0000ff, #7700ff, #ff0077, #ff0000, #ff7700, #ffff00)',
                  'linear-gradient(180deg, #00ff00, #0077ff, #0000ff, #7700ff, #ff0077, #ff0000, #ff7700, #ffff00, #00ff00)',
                  'linear-gradient(225deg, #0077ff, #0000ff, #7700ff, #ff0077, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff)',
                  'linear-gradient(270deg, #0000ff, #7700ff, #ff0077, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #0000ff)',
                  'linear-gradient(315deg, #7700ff, #ff0077, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #0000ff, #7700ff)',
                  'linear-gradient(360deg, #ff0077, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #0000ff, #7700ff, #ff0077)'
                ]
              : 'transparent'
          }}
          transition={{
            duration: showRainbow ? 3 : 0.3,
            repeat: showRainbow ? Infinity : 0,
            ease: "linear"
          }}
        >
          <Input
            placeholder="Describe your imagination..."
            value={prompt}
            onChange={(e) => handlePromptChange(e.target.value)}
            onKeyUp={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isGenerating}
            className="w-full bg-muted border-0 placeholder-muted-foreground h-12 text-base overflow-x-auto rounded-md"
            style={{
              textOverflow: 'clip',
              whiteSpace: 'nowrap'
            }}
          />
        </motion.div>

        {/* Buttons and settings below input */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <Button
              size="sm"
              variant={generationMode === "image" ? "default" : "ghost"}
              onClick={() => setGenerationMode("image")}
              disabled={isGenerating}
              className={`flex-1 h-10 text-sm ${
                generationMode === "image"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Image
            </Button>
            <Button
              size="sm"
              variant={generationMode === "video" ? "default" : "ghost"}
              onClick={() => setGenerationMode("video")}
              disabled={isGenerating}
              className={`flex-1 h-10 text-sm ${
                generationMode === "video"
                  ? "bg-pink-600 hover:bg-pink-700 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Video className="h-4 w-4 mr-2" />
              Video
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="text-muted-foreground hover:text-foreground hover:bg-accent h-10 px-3"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Settings Modal */}
      <SettingsModal
        open={showSettings}
        onOpenChange={setShowSettings}
      />
    </>
  )
}