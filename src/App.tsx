import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"; // Adicione useLocation

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import Board from "./pages/board";
import SoftBackdrop from "./components/SoftBackdrop";
import Footer from "./components/Footer";
import LenisScroll from "./components/lenis";

// ... outros imports
import TeamManager from "./pages/TeamManager"; // <--- 1. Importe a página nova

function AppContent() {
  const location = useLocation();

  // 2. Adicione "/tarefas" (ou o nome que quiser) na lista para esconder a Navbar principal
  const hideLayoutPaths = ["/board", "/signin", "/signup", "/tarefas"];
  
  const showLayout = !hideLayoutPaths.includes(location.pathname);

  return (
    <>
      <SoftBackdrop />
      <LenisScroll />

      {showLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/board" element={<Board />} />
        
        {/* 3. Crie a rota para acessar o gerenciador */}
        <Route path="/tarefas" element={<TeamManager />} />
      </Routes>

      {showLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;