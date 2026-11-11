# cinema8-ai-demo

Static HTML prototype for the Cinema8 **AI Tools** home (`/ai`) — a Dreamina-inspired layout proposing how the tool catalog, hero composer and tool detail pages should look.

Everything is **mock** — no API calls, no backend, no persistence. Click Generate and you'll see a loader followed by a gradient placeholder.

## Pages

| URL | What it mocks |
|---|---|
| `index.html` | AI home: sidebar + hero composer + Video / Audio / Image shelves + showcase |
| `pages/text-to-video.html` | Prompt → video composer with model / aspect / length |
| `pages/image-to-video.html` | Image uploader + motion prompt |
| `pages/motion-transfer.html` | Source video + character + recipe library (AI-183 / Seedance) |
| `pages/avatar.html` | Portrait + voice source + model (Cinema8 / OmniHuman) |
| `pages/video-studio.html` | Scene-by-scene film builder with timeline (extend chain) |

## Run locally

Any static server works. Fastest:

```bash
cd cinema8-ai-demo
python3 -m http.server 8000
# open http://localhost:8000
```

Or just double-click `index.html` — it uses relative paths only.

## Brand

- Primary: `#A101FF` (Cinema8 purple)
- Font: Inter 400/500/600/700, JetBrains Mono for pills
- Dark canvas, light cards on tool pages
