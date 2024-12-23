import { RouterProvider } from 'react-router-dom';
import { router } from './router/routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './components/ScrollToTop';
import { useTheme } from './context/ThemeContext';
import "./app.css"
import 'react-datepicker/dist/react-datepicker.css'; 




function App() {
  <ScrollToTop />
  const { theme } = useTheme();
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
      <ToastContainer theme={theme === "dark" ? "dark" :  "light"} />
    </>
  )
}

export default App
