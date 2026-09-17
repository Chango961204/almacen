import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "9999px",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            color: "#0f172a",
            fontSize: "14px",
            fontWeight: 500,
            border: "1px solid rgba(255,255,255,0.7)",
            boxShadow: "0 12px 32px rgba(15,23,42,0.14), inset 0 1px 0 rgba(255,255,255,0.8)",
            padding: "10px 18px",
          },
          success: {
            iconTheme: { primary: "#10b981", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#f43f5e", secondary: "#fff" },
          },
          duration: 3500,
        }}
      />
    </AuthProvider>
  );
}

export default App;