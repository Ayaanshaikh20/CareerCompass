import { Toaster, ReactQueryDevtools, QueryClient, QueryClientProvider, BrowserRouter, createRoot, Router, Theme } from "./shared/Imports.js";
import "./assets/styles/styles.css";
import "@radix-ui/themes/styles.css";
import "@fontsource/roboto";
import "../email.config.js";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Theme>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Toaster position="top-right" />
        <Router />
      </BrowserRouter>
    </Theme>
  </QueryClientProvider>
);
