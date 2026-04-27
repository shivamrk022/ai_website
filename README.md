# 🤖 Shivam AI Automation — Next-Gen Industrial Solutions

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=for-the-badge&logo=font-awesome&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white)

**A modern, fully responsive industrial automation website with AI chatbot, dark/light mode, and interactive UI components.**

[🌐 Live Demo](https://shivamrk022.github.io/ai_website/) &nbsp;|&nbsp; [📁 Repository](https://github.com/shivamrk022/ai_website) &nbsp;|&nbsp; [💬 WhatsApp](https://wa.me/919702515105)

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [How to Update & Push](#-how-to-update--push)
- [Sections Overview](#-sections-overview)
- [Dark Mode](#-dark-mode)
- [AI Chatbot](#-ai-chatbot)
- [Contact](#-contact)
- [License](#-license)

---

## 🚀 About the Project

**Shivam AI Automation** is a professional business website for an industrial automation company. It showcases AI-powered solutions including PLC Programming, Robotic Process Automation, and Smart Factory Integration. The site features a modern dark-themed design with glassmorphism effects, smooth animations, and a fully functional AI assistant chatbot.

> Built with pure **HTML, CSS, and JavaScript** — no frameworks, no dependencies, loads instantly.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌙 **Dark / Light Mode** | Persistent theme toggle saved to `localStorage` |
| 🤖 **AI Chatbot** | Smart keyword-based assistant for industrial queries |
| 📱 **WhatsApp Button** | Floating one-click WhatsApp contact button |
| 📋 **Contact Form** | Full enquiry form with validation |
| ❓ **FAQ Accordion** | Animated expandable FAQ section |
| 🏭 **Solutions Cards** | Industry service showcase with gradient banners |
| 📊 **AI Dashboard** | Fullscreen interactive AI core metrics overlay |
| 🗺️ **Location Map** | Embedded Google Maps section |
| 📍 **Sticky Navigation** | Glassmorphism navbar with dropdown menus |
| ⚡ **Hero Video** | Animated circuit board video background |
| 🎨 **Gradient Animations** | SVG logo with animated rotating particles |
| 📱 **Fully Responsive** | Works on all screen sizes |
| 🔒 **Offline-Ready** | Card images use pure CSS gradients + inline SVGs |

---

## 🛠️ Tech Stack

- **HTML5** — Semantic page structure
- **CSS3** — Custom properties, glassmorphism, animations, dark mode
- **Vanilla JavaScript** — Chatbot engine, theme toggle, FAQ accordion, form handling
- **Font Awesome 6.5** — Icons (CDN + local fallback)
- **Google Fonts** — Inter font family
- **Google Maps** — Embedded location iframe

> **No React. No Vue. No Tailwind. No build step required.**

---

## 📁 Project Structure

```
ai_website/
│
├── index.html              # Main website file (all-in-one)
├── images/                 # Local card images
│   ├── industrial1.jpg     # PLC Programming card
│   ├── industrial2.jpg     # Robotic Automation card
│   ├── industrial3.jpg     # Smart Factory card
│   ├── vision-transformer.jpg  # Dashboard - Vision AI card
│   └── kinematic-sync.jpg      # Dashboard - Robotics card
│
├── .gitignore              # Git ignore rules
├── push-to-github.bat      # One-click auto push script (Windows)
└── README.md               # Project documentation
```

---

## 🏁 Getting Started

### Option 1 — Open directly (simplest)
```
1. Clone or download this repo
2. Double-click index.html
3. Opens in your browser instantly — no server needed
```

### Option 2 — Clone via Git
```bash
git clone https://github.com/shivamrk022/ai_website.git
cd ai_website
# Open index.html in your browser
start index.html
```

### Option 3 — VS Code Live Server
```
1. Open folder in VS Code
2. Install "Live Server" extension
3. Right-click index.html → Open with Live Server
```

---

## 🔄 How to Update & Push

After making any changes to the project, push to GitHub using the included script:

### Windows (Double-click)
```
📁 ai_website/
  └── 🖱️ push-to-github.bat  ← just double-click this!
```

### Manual (Terminal)
```bash
git add -A
git commit -m "Your update message"
git push origin main
```

### Enable GitHub Pages (Free Hosting)
1. Go to → **Settings → Pages**
2. Source: **main** branch → **/ (root)**
3. Save → your site is live at:
   > `https://shivamrk022.github.io/ai_website/`

---

## 📄 Sections Overview

### 🏠 Hero Section
- Full-screen animated circuit board video background
- Gradient overlay with headline and CTA button
- Opens **AI Core Dashboard** overlay on click

### 🏭 Our Solutions
Three service cards with gradient banners and inline SVG icons:
- **Industrial PLC Programming** — Custom Siemens, Allen-Bradley, Mitsubishi logic
- **Robotic Process Automation** — End-to-end pick-and-place, welding, assembly
- **Smart Factory Integration** — IoT dashboards, sensor networks, Industry 4.0

### ❓ FAQ
Accordion-style expandable questions covering:
- Industry specializations
- Implementation timelines
- Legacy system support

### 📬 Contact Form
- Name, Email, Phone inputs
- Interest selector (Robotics / PLC / AI Vision)
- Project requirements textarea
- Confirmation alert on submit

### 📊 AI Core Dashboard
Fullscreen overlay showing:
- Neural Power: 4.2 PetaFLOPS
- Active Nodes: 1,284
- Latency: 2.4ms
- Vision Transformer status card
- Kinematic Sync status card

### 🗺️ Our Location
- Embedded Google Maps (Palghar, Maharashtra)
- Auto-inverted in dark mode for visual consistency

---

## 🌙 Dark Mode

The theme toggle button (☀️/🌙) switches between light and dark themes:
- **Saves preference** to `localStorage` — persists across page refreshes
- **Dark palette**: `#010409` background, `#161b22` cards, `#58a6ff` accents
- **Light palette**: Pure white background, standard blue accents
- All elements including nav, cards, forms, FAQ, footer adapt automatically

---

## 🤖 AI Chatbot

The floating robot button opens an AI assistant that understands queries about:

| Keyword | Response Topic |
|---|---|
| `plc`, `siemens`, `allen` | PLC programming services |
| `robot`, `robotic` | Robotic automation |
| `iot`, `smart factory` | Industry 4.0 solutions |
| `price`, `cost`, `quote` | Pricing information |
| `contact`, `email`, `phone` | Contact details |
| `time`, `weeks`, `duration` | Implementation timeline |
| `hello`, `hi`, `hey` | Greeting response |

Features:
- ✅ Typing indicator animation (`...`)
- ✅ Markdown-style `<strong>` bold in replies
- ✅ Fully works offline — no API needed

---

## 📞 Contact

**Shivam Maurya**

| Platform | Link |
|---|---|
| 📧 Email | contact@shivam-ai.com |
| 💬 WhatsApp | [+91 97025 15105](https://wa.me/919702515105) |
| 🐙 GitHub | [@shivamrk022](https://github.com/shivamrk022) |
| 🌐 Website | [shivam-maurya-645957.netlify.app](https://shivam-maurya-645957.netlify.app) |

---

## 📜 License

This project is licensed under the **MIT License** — free to use, modify and distribute.

```
MIT License © 2026 Shivam Maurya
```

---

<div align="center">

⭐ **If you found this project helpful, please give it a star on GitHub!** ⭐

Made with ❤️ by **Shivam Maurya** — Powering Industrial Automation with AI

</div>
