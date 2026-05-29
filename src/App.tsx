import { ExportPage } from "./pages/ExportPage";
import { StudioPage } from "./pages/StudioPage";

export function App() {
  if (window.location.pathname.startsWith("/export/")) {
    return <ExportPage />;
  }

  return <StudioPage />;
}
