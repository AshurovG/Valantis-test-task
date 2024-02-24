import Header from 'components/Header'
import { HashRouter, Route, Routes, Navigate } from "react-router-dom"
import ProductsPage from 'pages/ProductsPage'

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
    </>
  )
}

export default App
