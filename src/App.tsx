
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Index from "./pages/Index";
import About from "./pages/About";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Puzzle from "./pages/Puzzle";
import Practice from "./pages/Practice";
import GameOfWeek from "./pages/GameOfWeek";
import AdminLogin from "./pages/AdminLogin";

import Tutorials from "./pages/Tutorials";
import AdminPanel from "./components/admin/AdminPanel";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/shared/ProtectedRoute";

const queryClient = new QueryClient();

// Create a layout component to handle conditional rendering
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  // Hide Navbar/Footer on admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />

              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/puzzle" element={<Puzzle />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/game-of-week" element={<GameOfWeek />} />
              <Route path="/admin-login" element={<AdminLogin />} />

              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
