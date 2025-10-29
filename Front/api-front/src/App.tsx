<<<<<<< Updated upstream
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Principal from './pages/Principal.tsx';
import Pasajeros from './pages/Pasajeros.tsx';
import Viajes from './pages/Viajes.tsx';
import Ciudades from './pages/Ciudades.tsx';
import Categorias from './pages/Categorias.tsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Principal />} />
      <Route path="/viajes" element={<Viajes />} />
      <Route path="/pasajeros" element={<Pasajeros />} />
      <Route path="/ciudades" element={<Ciudades />} />
      <Route path="/categorias" element={<Categorias />} />
    </Routes>
=======
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.tsx";
import Home from "./pages/Home.tsx";
import Categorias from "./pages/Categorias.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categorias" element={<Categorias />} />
      </Routes>
    </BrowserRouter>
>>>>>>> Stashed changes
  );
}
