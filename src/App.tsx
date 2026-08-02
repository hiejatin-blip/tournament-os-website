import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/app/routes";
import { AuthProvider } from "@/features/auth";
import { CopilotProvider } from "@/features/ai";
import { MotionProvider } from "@/shared/motion/MotionProvider";
import { SearchProvider } from "@/shared/search/SearchProvider";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/shared/system/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <MotionProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL?.replace(/\/$/, "") ?? ""}>
          <SearchProvider>
            <AuthProvider>
              <CopilotProvider>
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-cyan-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-void-950"
                >
                  Skip to content
                </a>
                <AppRoutes />
                <Toaster position="bottom-right" richColors closeButton />
              </CopilotProvider>
            </AuthProvider>
          </SearchProvider>
        </BrowserRouter>
      </MotionProvider>
    </ErrorBoundary>
  );
}
