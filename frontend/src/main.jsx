import { createRoot } from 'react-dom/client';
import Router from './config/Router.jsx';
import { BrowserRouter } from 'react-router';
import './assets/styles.css';
import '@fontsource/roboto';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <BrowserRouter>
    <Toaster />
      <Router />
    </BrowserRouter>
  </QueryClientProvider>
);
