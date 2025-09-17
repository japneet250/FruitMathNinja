# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Setup (local)
1. Create a project folder and paste the files in the structure above.
2. Run:

```bash
npm install
npm run start
```

3. Open the localhost URL printed by Vite (usually http://localhost:5173).

## Next steps (Hackathon)
- Implement a tiny Flask/FastAPI backend endpoint `/recognize` that accepts the PNG and calls MathPix or runs a handwriting recognition model.
- Add WebSocket or DynamoDB Streams for real-time collaboration.
- Add LaTeX rendering (KaTeX) and graphing (Desmos) on the frontend.

*/
