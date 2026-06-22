(window as any).global = window;
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

registerSW({
  immediate: true,
  onRegistered(r) {
    console.log("Service Worker successfully registered:", r);
  },
  onRegisterError(error) {
    console.error("Service Worker registration failed:", error);
  }
});

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { queryClient } from "./api/queryClient";

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "govlyx-query-cache",
});

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60, // Cache valid for 1 hour
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const key = query.queryKey[0];
            return key === "feed" || key === "currentUser";
          },
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistQueryClientProvider>
  </React.StrictMode>
);