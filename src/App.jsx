import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import AppRoutes from "./routes/index.jsx";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FCMHandler from "./hooks/FCMHandler.js";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <AppRoutes />
          <FCMHandler /> {/* 👈 Moved here */}
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
