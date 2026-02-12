import { createApp } from "vue";
import {
  Quasar,
  Notify,
  Dialog,
  Loading,
  LocalStorage,
  SessionStorage,
} from "quasar";
import App from "./App.vue";
import router from "./routes";
import pinia from "./store";

// Import Quasar css
import "quasar/dist/quasar.css";
// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";

import "./style.css";

const app = createApp(App);

// Use Quasar
app.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
    Loading,
    LocalStorage,
    SessionStorage,
  },
  config: {
    brand: {
      primary: "#10B981", // Emerald 500
      secondary: "#34D399", // Emerald 400
      accent: "#8B5CF6", // Violet 500
      dark: "#0F172A", // Slate 900
      positive: "#10B981",
      negative: "#F43F5E",
      info: "#0EA5E9",
      warning: "#F59E0B",
    },
    dark: true, // Enable dark mode by default
  },
});

// Use Vue Router
app.use(router);

// Use Pinia
app.use(pinia);

app.mount("#app");
