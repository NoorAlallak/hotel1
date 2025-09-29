import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthContextProvider } from "./Authentication/AuthContextProvider.jsx";
import { FavoritesProvider } from "./Authentication/FavoriteContext.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </AuthContextProvider>
  </StrictMode>
);
