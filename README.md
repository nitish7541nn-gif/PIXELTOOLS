# Pixel Tools

A professional-grade, 100% browser-based suite of image utilities including Compression, Resizing, and Cropping.

## Features
- **Image Compression**: Reduce file size without losing quality.
- **Image Resizer**: Batch scale images to specific dimensions or presets.
- **Image Cropper**: Precise framing and extraction for any aspect ratio.
- **Privacy First**: All processing happens locally in your browser. No images are ever uploaded to a server.

## Deployment to Netlify

1. **GitHub Upload**:
   - Create a new repository on GitHub.
   - Run the following commands in your local project folder:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin YOUR_GITHUB_REPO_URL
     git push -u origin main
     ```

2. **Netlify Setup**:
   - Go to [Netlify](https://www.netlify.com/) and log in.
   - Click **"Add new site"** -> **"Import from GitHub"**.
   - Select your `Pixel Tools` repository.
   - Configure the build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Click **"Deploy site"**.

## Technology Stack
- **React 19** + **TypeScript**
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **Motion** (Animations)
- **Lucide React** (Icons)
- **Browser Image Compression**
- **React Easy Crop**
