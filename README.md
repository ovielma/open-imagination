<img src="/public/OpenImagination-logo.png" width="400" />


A open-source AI-powered creative studio built with Next.js 15, TypeScript, and Tailwind CSS. Generate stunning images and videos using Google's Gemini AI models including Imagen, Veo2, and Veo3.

## ✨ Features

- **🎨 Image Generation** - Create high-quality images from text descriptions using Google Imagen 4. Creates 2 images on a 2x2 grid.
- **🎬 Video Generation** - Generate videos with sound from text prompts using Veo3. Creates 2 videos on a 2x2 grid.
- **🔄 Image-to-Video** - Transform static images into dynamic videos with Veo2
- **🌓 Dark/Light Mode** - Toggle between themes with system preference support
- **Download** - Download generated images and videos
- **Film Strip Navigation** - Navigate through generated images and videos with a film strip interface inspired by MidJourney

## AI Models Used

### **Imagen 4** (Image Generation)
- **Model**: `imagen-3.0-generate-001`
- **Output**: 2 high-quality 1024x1024 images
- **Format**: Base64 encoded PNG

### **Veo 3** (Text-to-Video)
- **Model**: `veo-3`
- **Output**: High quality video generation with audio
- **Duration**: ~3-8 seconds, 720p

### **Veo 2** (Image-to-Video)
- **Model**: `veo-2.0-generate-001` with image input
- **Input**: Base64 image + text prompt
- **Output**: Animated video from static image

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Theme**: next-themes
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Google Cloud Platform account (for Gemini API)
- Docker (optional, for containerized deployment)

## 🛠️ Local Development

## 1. Clone the Repository

```
git clone https://github.com/ovielma/open-imagination.git
cd open-imagination
```

## 2. Install Dependencies

``` npm install``` or ```yarn install``` or ```pnpm install```

## 3. Environment Setup

This application stores your api key in your browser session. You can enter it in the UI. However, if you want to store it in a environment variable, you can copy the API key to your `.env.local` file

#### Copy the environment template
```cp .env.example .env.local```

## 4. Get Your Google Gemini API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to **APIs & Services > Credentials**
4. Click **Create Credentials > API Key**

## 5. Run the Development Server

```npm run dev``` or ```yarn dev``` or ```pnpm dev```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🚀 Deployment

### **Vercel** (Recommended)
```
npm run build
npx vercel --prod
```

## 🐳 Docker Deployment

```
docker build -t openjourney .
docker run -p 3000:3000 openjourney
```

The application will be available at [http://localhost:3000](http://localhost:3000).


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful and accessible UI components
- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit
- [Google AI](https://ai.google/) - Powerful AI models and APIs
- [MidJourney](https://midjourney.com/) - AI image generation inspiration

## Follow me on X

- [@cybermingling](https://x.com/cybermingling)