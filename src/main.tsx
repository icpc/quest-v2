import React from "react";
import ReactDOM from "react-dom/client";

import {
  RouterProvider,
  createHashHistory,
  createRouter,
} from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  context: {
    user: null,
    website_settings: null,
  },
  history: createHashHistory(),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
