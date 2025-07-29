import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import AppRoutes from "./routes/index.jsx";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FCMHandler from "./hooks/FCMHandler.js";
import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase/firebaseConfig.js";
import Message from "./components/Message.jsx";
function App() {
  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
    toast(<Message notification={payload.notification} />);
  });

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
