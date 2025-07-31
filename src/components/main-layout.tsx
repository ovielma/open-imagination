// "use client"

// import type React from "react"
// import Image from "next/image"
// import { useState } from "react"
// import { useToast } from "@/hooks/use-toast"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { SettingsModal } from "@/components/settings-modal"
// import { LoadGrid } from "@/components/load-grid"
// import { ExpandedMediaView } from "@/components/expanded-media-view"
// import { PromptBar } from "@/components/prompt-bar"
// import { Settings, ImageIcon, Video } from "lucide-react"

// export interface MediaItem {
//   id: number
//   url: string
//   title: string
//   prompt: string
//   model: "Imagen" | "Veo3" | "Veo2"
//   type: "image" | "video"
//   aspectRatio: string
//   likes: number
//   duration?: string
//   user: string
//   timeAgo: string
// }

// // Reduced to 6 sample items as requested
// const sampleMedia: MediaItem[] = [
//   {
//     id: 1,
//     url: "/placeholder.svg?height=600&width=400",
//     title: "Urban Anime Character",
//     prompt:
//       "A fashion magazine cover. The main title 'NEO TOKYO' is in a bold, clean font. A beautiful girl with a chic short haircut and yellow-tinted sunglasses stands confidently in the middle of a deserted Shibuya Scramble Crossing at dawn.",
//     model: "Imagen",
//     type: "image",
//     aspectRatio: "3:4",
//     likes: 234,
//     user: "u483296456",
//     timeAgo: "20h",
//   },
//   {
//     id: 2,
//     url: "/placeholder.svg?height=400&width=600",
//     title: "Sparkling Citrus",
//     prompt:
//       "Close-up macro photography of fresh citrus fruits with sparkling water droplets, vibrant colors, studio lighting",
//     model: "Imagen",
//     type: "image",
//     aspectRatio: "3:2",
//     likes: 189,
//     user: "u392847561",
//     timeAgo: "15h",
//   },
//   {
//     id: 3,
//     url: "/placeholder.svg?height=500&width=400",
//     title: "Astronaut Reflection",
//     prompt:
//       "An astronaut floating peacefully above Earth's ocean, cinematic lighting, reflective helmet showing Earth's curvature",
//     model: "Veo3",
//     type: "video",
//     aspectRatio: "4:5",
//     likes: 456,
//     duration: "5s",
//     user: "u847392015",
//     timeAgo: "12h",
//   },
//   {
//     id: 4,
//     url: "/placeholder.svg?height=600&width=400",
//     title: "Glowing Silhouette",
//     prompt: "Ethereal glowing human silhouette in a magical forest, golden hour lighting, mystical atmosphere",
//     model: "Imagen",
//     type: "image",
//     aspectRatio: "2:3",
//     likes: 312,
//     user: "u192847365",
//     timeAgo: "8h",
//   },
//   {
//     id: 5,
//     url: "/placeholder.svg?height=400&width=400",
//     title: "Gourmet Bruschetta",
//     prompt:
//       "Artisanal bruschetta with fresh tomatoes and herbs, professional food photography, rustic wooden background",
//     model: "Imagen",
//     type: "image",
//     aspectRatio: "1:1",
//     likes: 167,
//     user: "u573829104",
//     timeAgo: "6h",
//   },
//   {
//     id: 6,
//     url: "/placeholder.svg?height=300&width=400",
//     title: "Steam and Water",
//     prompt: "Abstract water and steam effects, dramatic lighting, high-speed photography capturing fluid motion",
//     model: "Veo2",
//     type: "video",
//     aspectRatio: "4:3",
//     likes: 145,
//     duration: "3s",
//     user: "u847291056",
//     timeAgo: "4h",
//   },
// ]

// export function MainLayout() {
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false)
//   const [expandedItem, setExpandedItem] = useState<MediaItem | null>(null)
//   const [prompt, setPrompt] = useState("")
//   const [generationMode, setGenerationMode] = useState<"image" | "video">("image")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [generatedItems, setGeneratedItems] = useState<MediaItem[]>([])
//   const { toast } = useToast()

//   const handleGenerate = async () => {
//     if (!prompt.trim()) return

//     // Check if API key is available
//     const apiKey = typeof window !== "undefined" ? sessionStorage.getItem("gemini_api_key") : null
//     if (!apiKey) {
//       toast({
//         title: "API Key Required",
//         description: "Please set your Google Gemini API key in settings first.",
//         variant: "destructive"
//       })
//       setIsSettingsOpen(true)
//       return
//     }

//     setIsGenerating(true)
    
//     try {
//       if (generationMode === "image") {
//         const response = await fetch('/api/image-generator', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'x-api-key': apiKey
//           },
//           body: JSON.stringify({
//             prompt: prompt,
//             aspectRatio: "1:1",
//             quality: "standard"
//           })
//         })

//         const result = await response.json()
        
//         if (!response.ok) {
//           throw new Error(result.error || 'Image generation failed')
//         }

//         if (result.success && result.images) {
//           // Create media items for each generated image
//           const newItems: MediaItem[] = result.images.map((image: any, index: number) => ({
//             id: Date.now() + index,
//             url: image.url,
//             title: `${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''} ${index + 1}`,
//             prompt: prompt,
//             model: "Imagen" as const,
//             type: "image" as const,
//             aspectRatio: "1:1",
//             likes: 0,
//             user: "You",
//             timeAgo: "Just now"
//           }))
          
//           setGeneratedItems(prev => [...newItems, ...prev])
//           setPrompt("") // Clear the prompt
          
//           toast({
//             title: "Images Generated!",
//             description: `${result.images.length} image(s) created successfully.`
//           })
//         } else {
//           throw new Error(result.error || 'Image generation failed')
//         }
//       } else {
//         // Video generation
//         const response = await fetch('/api/video-generator', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             prompt: prompt,
//             apiKey: apiKey
//           })
//         })

//         const result = await response.json()
        
//         if (!response.ok) {
//           throw new Error(result.error || 'Video generation failed')
//         }

//         if (result.success && result.videos) {
//           // Create media items for each generated video
//           const newItems: MediaItem[] = result.videos.map((video: any, index: number) => ({
//             id: Date.now() + index,
//             url: video.url,
//             title: `${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''} ${index + 1}`,
//             prompt: prompt,
//             model: "Veo3" as const,
//             type: "video" as const,
//             aspectRatio: "16:9",
//             likes: 0,
//             duration: "5s",
//             user: "You",
//             timeAgo: "Just now"
//           }))
          
//           setGeneratedItems(prev => [...newItems, ...prev])
//           setPrompt("") // Clear the prompt
          
//           toast({
//             title: "Videos Generated!",
//             description: `${result.videos.length} video(s) created successfully.`
//           })
//         } else {
//           throw new Error(result.error || 'Video generation failed')
//         }
//       }
//     } catch (error) {
//       console.error('Generation failed:', error)
//       toast({
//         title: "Generation Failed",
//         description: error instanceof Error ? error.message : "An unknown error occurred",
//         variant: "destructive"
//       })
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       handleGenerate()
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       {/* Top Navigation */}
//       <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
//         <div className="container mx-auto px-4 py-4">
//           {/* Desktop Layout - Horizontal */}
//           <div className="hidden md:flex items-center gap-6">
//             {/* Logo */}
//             <div className="flex items-center flex-shrink-0">
//               <Image
//                 src="/OpenImagination-logo.png"
//                 alt="OpenImagination"
//                 width={200}
//                 height={40}
//                 className="h-10 w-auto dark:invert"
//                 priority
//                 sizes="(max-width: 640px) 150px, (max-width: 768px) 200px, (max-width: 1024px) 250px, 300px"
//               />
//             </div>

//             <PromptBar
//               prompt={prompt}
//               onPromptChange={setPrompt}
//               onKeyPress={handleKeyPress}
//               generationMode={generationMode}
//               onGenerationModeChange={setGenerationMode}
//               onSettingsClick={() => setIsSettingsOpen(true)}
//               isGenerating={isGenerating}
//             />
//           </div>

//           {/* Mobile Layout - Vertical Stack */}
//           <div className="md:hidden space-y-4">
//             {/* Logo at top */}
//             <div className="flex justify-center">
//               <Image
//                 src="/OpenImagination-logo.png"
//                 alt="OpenImagination"
//                 width={180}
//                 height={36}
//                 className="h-9 w-auto dark:invert"
//                 priority
//                 sizes="180px"
//               />
//             </div>

//             <PromptBar
//               prompt={prompt}
//               onPromptChange={setPrompt}
//               onKeyPress={handleKeyPress}
//               generationMode={generationMode}
//               onGenerationModeChange={setGenerationMode}
//               onSettingsClick={() => setIsSettingsOpen(true)}
//               isGenerating={isGenerating}
//             />
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-6 py-8">
//         <LoadGrid 
//           mediaItems={[...generatedItems, ...sampleMedia]} 
//           onItemClick={setExpandedItem}
//           isLoading={isGenerating}
//           onAnimateWithVeo2={(item) => {
//             // TODO: Implement Veo2 animation functionality
//             console.log('Animating with Veo2:', item.title)
//           }}
//         />
//       </main>

//       {/* Modals */}
//       <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />

//       {expandedItem && (
//         <ExpandedMediaView
//           isOpen={true}
//           onClose={() => setExpandedItem(null)}
//           mediaItems={[...generatedItems, ...sampleMedia]}
//           initialIndex={[...generatedItems, ...sampleMedia].findIndex(item => item.id === expandedItem.id)}
//         />
//       )}
//     </div>
//   )
// }
