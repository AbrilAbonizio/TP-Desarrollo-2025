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
  );
}
