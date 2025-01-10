import { createRoot } from "react-dom/client";
import "./assets/styles/index.css";
import "./assets/styles/tailwind.css";
import App from "./App.jsx";
import { Provider } from "react-redux";

import { persistor, store } from "./store/index.js";
import { StrictMode } from "react";
import { PersistGate } from "redux-persist/integration/react";
import LoadingScreen from "./components/common/LoadingScreen.jsx";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

if (import.meta.env.PROD) {
  disableReactDevTools();
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
