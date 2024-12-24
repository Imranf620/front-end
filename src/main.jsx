import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import store from "./store.js";
import { Provider } from "react-redux";
import ReFetchState from "./context/ReFetchContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter 
  future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true 
  }}>
    <ThemeProvider>
      <Provider store={store}>
        <ReFetchState>
      <App />
        </ReFetchState>
      </Provider>
    </ThemeProvider>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </BrowserRouter>
);
