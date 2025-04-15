import { createRoot } from 'react-dom/client';
import Router from './config/Router';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </QueryClientProvider>,
);