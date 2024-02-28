import Header from 'components/Header'
import { HashRouter, Route, Routes, Navigate } from "react-router-dom"
import ProductsPage from 'pages/ProductsPage'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Header />
      <HashRouter>
        <Routes>
          <Route path="/" element={<ProductsPage />}></Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
      <ToastContainer autoClose={1500} pauseOnHover={false} />
    </>
  )
}

export default App
