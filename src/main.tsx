import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Sin StrictMode: evita el doble montaje de efectos en canvas/GSAP/Lenis,
// que producía un parpadeo de "doble carga" en la pieza del hero.
createRoot(document.getElementById("root")!).render(<App />);
