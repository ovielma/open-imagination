"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Key, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ModeToggle } from "@/components/mode-toggle"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const { toast } = useToast()

  // Load API key from browser memory on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = sessionStorage.getItem("gemini_api_key")
      if (savedKey) {
        setApiKey(savedKey)
      }
    }
  }, [])

  const handleSave = () => {
    if (typeof window !== "undefined") {
      // Store API key in browser session storage (memory only, not persistent)
      if (apiKey.trim()) {
        sessionStorage.setItem("gemini_api_key", apiKey.trim())
        toast({
          title: "Settings saved",
          description: "Your API key has been saved for this session.",
        })
      } else {
        sessionStorage.removeItem("gemini_api_key")
        toast({
          title: "API key cleared",
          description: "Your API key has been removed.",
        })
      }
    }
    onOpenChange(false)
  }

  const handleClear = () => {
    setApiKey("")
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("gemini_api_key")
    }
    toast({
      title: "API key cleared",
      description: "Your API key has been removed.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>Configure your API settings and preferences.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Theme Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <Label className="text-sm font-medium">Appearance</Label>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm">Theme</p>
                <p className="text-xs text-muted-foreground">Choose your preferred color scheme</p>
              </div>
              <ModeToggle />
            </div>
          </div>

          <Separator />

          {/* API Key Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <Label className="text-sm font-medium">API Configuration</Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="api-key">Google Gemini API Key</Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showApiKey ? "text" : "password"}
                  placeholder="Enter your API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get your API key from the{" "}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  Google Cloud Console
                </a>
              </p>
              <p className="text-xs text-muted-foreground">
                Your API key is stored only in your browser's memory and will be cleared when you close the tab.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleClear}>
            Clear Key
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
