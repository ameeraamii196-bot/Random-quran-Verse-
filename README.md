# ☽ Heart Heal — Quranic Verse App

> A minimalist, single-page web application that displays a random Quranic verse with Arabic text, English translation, and live audio recitation.

Made with ❤️ by **Ameera**

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎲 Random Verse | Picks a random ayah from all 6,236 verses of the Quran |
| 🕌 Arabic Text | Displayed in the **Amiri** font with proper RTL rendering |
| 📖 Translation | **Sahih International** English translation |
| 🔊 Audio Recitation | Stream recitation by **Mishary Rashid Alafasy** |
| ⏳ Skeleton Screen | Shimmer loading state while the API fetches data |
| ⚠️ Error Handling | Friendly error messages with a "Try again" option |
| 📱 Responsive | Fully mobile-friendly layout |

---

## 🗂️ Project Structure

```
Heart_Heal/
├── index.html   # App structure and layout
├── style.css    # Custom animations, scrollbar, and font styles
├── script.js    # API calls, audio playback, and state management
└── README.md    # This file
```

---

## 🚀 Getting Started

No build tools or dependencies required. This is a pure HTML/CSS/JS app.

### Run locally

Simply open `index.html` in any modern browser:

```bash
# Option 1 — double-click index.html in File Explorer

# Option 2 — use VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

> **Note:** An active internet connection is required to fetch verses from the API and stream audio.

---

## 🔌 APIs Used

| Service | Purpose | Endpoint |
|---|---|---|
| [Al-Quran Cloud](https://alquran.cloud/api) | Verse text + audio URL | `https://api.alquran.cloud/v1/ayah/{n}/editions/quran-uthmani,en.sahih,ar.alafasy` |

### Editions requested in one call:
- `quran-uthmani` — Arabic text (Uthmani script)
- `en.sahih` — Sahih International English translation
- `ar.alafasy` — Audio by Mishary Rashid Alafasy

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure with ARIA accessibility attributes
- **Tailwind CSS** (CDN) — Utility-first styling with custom config
- **Vanilla JavaScript (ES6+)** — `async/await`, `fetch`, `AbortSignal.timeout`
- **Google Fonts** — [Amiri](https://fonts.google.com/specimen/Amiri) (Arabic) + [Inter](https://fonts.google.com/specimen/Inter) (UI)

---

## 🎨 Design

- **Color palette:** Deep forest green `#0d1f1a` background with sage green `#a8d5b5` accents and warm parchment `#e8dfc8` text
- **Dark mode** by default
- **Animations:** Fade-in on content load, shimmer skeleton, pulse ring on audio playback, rotate icon on "New Verse"
- **Glassmorphism card** with backdrop blur and subtle border

---

## ♿ Accessibility

- All interactive buttons have descriptive `aria-label` attributes
- Arabic text is marked with `lang="ar"` and `dir="rtl"`
- Focus rings are visible on all interactive elements
- Loading state has `role="status"` and `aria-label`

---

## 📋 How It Works

```
Page loads / "New Verse" clicked
        │
        ▼
showSkeleton() — disable button, show shimmer
        │
        ▼
fetch random ayah (1–6236) from Al-Quran Cloud API
        │
   ┌────┴────┐
  OK?       Error?
   │           │
   ▼           ▼
Populate    showError()
UI text     with message
+ audio src
   │
   ▼
showContent() — fade-in animation
```

---

## 🔮 Potential Future Enhancements

- [ ] Bookmark / save favourite verses
- [ ] Share verse as an image card
- [ ] Filter by Surah
- [ ] Multiple reciter options
- [ ] Prayer time widget integration
- [ ] PWA support for offline use

---

## 📄 License

This project is open source and free to use for personal and educational purposes.

---

*Recitation by Mishary Rashid Alafasy · Powered by Al-Quran Cloud API*
