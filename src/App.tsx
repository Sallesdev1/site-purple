import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"; // Adicione useLocation

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import Board from "./pages/board";
import SoftBackdrop from "./components/SoftBackdrop";
import Footer from "./components/Footer";
import LenisScroll from "./components/lenis";

// 1. Criamos um componente auxiliar que fica DENTRO do Router
function AppContent() {
  const location = useLocation();

  // Defina aqui as rotas onde a Navbar e o Footer DEVEM SUMIR
  // Geralmente Login, Cadastro e Dashboard não têm a navbar do site institucional
  const hideLayoutPaths = ["/board", "/signin", "/signup"];
  
  // Verifica se o caminho atual está na lista acima
  const showLayout = !hideLayoutPaths.includes(location.pathname);

  return (
    <>
      {/* Efeitos globais */}
      <SoftBackdrop />
      <LenisScroll />

      {/* A Navbar só aparece se showLayout for verdadeiro */}
      {showLayout && <Navbar />}

      {/* Rotas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/board" element={<Board />} />
      </Routes>

      {/* O Footer também costuma sumir no Dashboard */}
      {showLayout && <Footer />}
    </>
  );
}

// 2. O componente App principal apenas envolve tudo com o BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;