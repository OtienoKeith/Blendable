# Blendable

A minimal React + Vite + Tailwind CSS tool for optimizing yield on Blend pools.

## Features
- Select your current pool (mock data)
- Compare APYs and see if you can earn more
- Get notified via email (EmailJS integration)
- Modern, dark UI inspired by Blend

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the app:**
   ```bash
   npm run dev
   ```
3. **Open in browser:**
   Visit [http://localhost:3001/](http://localhost:3001/) (or the port shown in your terminal)

## Usage
- Select a pool from the dropdown.
- Click "Check for Better Yields" to compare APYs.
- Enter your email and click "Notify Me" to get an email notification if a better yield is found.
- A confirmation message will show the email address the notification was sent to.

## Notes
- **Pool data is mock only.** Real Blend API is not accessible due to CORS/IPFS issues. If Blend provides a working HTTP API, update the fetch logic in `Blendable.tsx`.
- **No backend required.** All logic is pure frontend.
- **Email notifications** use your configured EmailJS service/template/keys.

## Hackathon Ready
- No backend, no CORS, no network headaches. Just run and demo.

---

MIT License 