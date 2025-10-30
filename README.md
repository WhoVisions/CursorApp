# CursorApp

A minimal starter scaffold for the CursorApp project. This adds a simple static web app with a tiny interactive demo so you can open the app in a browser or serve it locally.

## Files added

- `index.html` — entry HTML file
- `src/main.js` — small JavaScript app (DOM + interaction)
- `src/styles.css` — basic styles
- `package.json` — minimal npm metadata and a start script using `npx serve`
- `.gitignore` — common ignores
- `LICENSE` — MIT license

## Quick start (Windows PowerShell)

1. Open PowerShell in the project root (`c:\Users\super\Documents\GitHub\CursorApp`).
2. To run quickly using npx (no install required):

```powershell
npx serve . -l 5000
```

3. Or open `index.html` directly in your browser.

The app will be available at http://localhost:5000 when using the command above.

### Alternate start

If `npx` is restricted by your environment, install `serve` globally and use the alternate script:

```powershell
npm i -g serve
serve . -l 5000
```

Then open:

```powershell
start http://localhost:5000
```

## Notes

This is a lightweight scaffold. If you want a full framework (React/Vite/Next) I can add that next.
