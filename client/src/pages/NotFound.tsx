import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container flex flex-col items-center justify-center min-h-screen text-center px-4 pt-16">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 start-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/5 blur-3xl" />
        </div>

        <div className="relative">
          <div className="mb-6 text-8xl font-extrabold gradient-text leading-none">404</div>
          <h1 className="mb-3 text-2xl font-bold text-foreground">Page Not Found</h1>
          <p className="mb-8 max-w-md text-muted-foreground leading-relaxed">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button
              onClick={() => setLocation("/")}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
