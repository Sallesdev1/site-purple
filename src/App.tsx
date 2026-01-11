import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Signin from "./pages/signin"
import SoftBackdrop from "./components/SoftBackdrop"
import Footer from "./components/Footer"
import LenisScroll from "./components/lenis"

function App() {
  return (
    <BrowserRouter>
      {/* Efeitos globais */}
      <SoftBackdrop />
      <LenisScroll />

      {/* Barra de navegação tela inicial fixo */}
      <Navbar />

      {/* Rotas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App