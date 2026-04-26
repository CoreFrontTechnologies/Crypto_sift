# Crypto Exposer: Next-Gen Forensic AI

## Project Overview
**Crypto Exposer** is a high-density, professional-grade fundamental analysis tool for cryptocurrency projects. Powered by advanced Gemini AI, it provides institutional-level audits in seconds, revealing the truth behind the marketing hype.

### Developed By
**Sayyed Muhammad** (Lead Software Engineer & Forensic Analyst)

---

## 🚀 Key Features
- **Deep Forensic Audits**: Analyzes team track records, investor legitimacy, technical innovation, and market moat.
- **Dynamic Scoring Dashboard**: Precision scoring (0-100) across five critical vectors (Tokenomics, Team, Technology, Moat, Risk).
- **Risk Detection Engine**: Automatically flags predatory red flags, scam patterns, and "rug" potential.
- **Institutional Verdict**: A definitive "FINAL RECOMMENDATION" based on calculated risk-to-reward ratios.
- **Modern High-Density UI**: A technical, dark-mode interface designed for power users, with smooth animations and responsive layouts.

## 🛠️ Technical Stack
- **Frontend**: React 18+ with Vite
- **AI Engine**: Google Gemini AI (Pro & Flash Models)
- **Styling**: Tailwind CSS (Utility-first CSS)
- **Animations**: Framer Motion (v12/motion)
- **Icons**: Lucide React
- **Type Safety**: TypeScript

---

## ⚙️ Deployment & Configuration

### Netlify Environment Variables
To ensure the application functions correctly on Netlify, you MUST set the following environment variable in your Netlify Site Settings (**Site configuration > Environment variables**):

| Key | Description |
|---|---|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API Key from [AI Studio](https://aistudio.google.com/) |

### Local Development
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your key:
   ```env
   VITE_GEMINI_API_KEY=your_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 🛡️ Security Disclaimer
This tool provides AI-generated analysis for educational and informational purposes only. It does not constitute financial advice. Always perform your own due diligence before making investment decisions.

---
© 2024 Crypto Exposer. All rights reserved. Developed with passion by **Sayyed Muhammad**.
