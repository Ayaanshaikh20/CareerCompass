import { Toaster, ReactQueryDevtools, QueryClient, QueryClientProvider, BrowserRouter, createRoot, Router } from "./shared/imports.js";
import "./assets/styles.css";
import "@fontsource/roboto";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <BrowserRouter>
      <Toaster />
      <Router />
    </BrowserRouter>
  </QueryClientProvider>
);
