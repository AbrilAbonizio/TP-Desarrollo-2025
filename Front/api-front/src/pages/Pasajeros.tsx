import { useEffect, useState } from 'react';
import { getAllPasajeros } from '../services/Pasajero.Service.ts';
import { Pasajero } from '../types/Pasajero.ts';

export default function Pasajeros() {
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPasajeros()
      .then((res) => {
        console.log('Datos recibidos:', res.data);
        setPasajeros(res.data);
      })
      .catch((err) => setError((err as Error)?.message ?? String(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando pasajeros...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log(pasajeros);
  return (
    <div className="container mt-4">
      <h2>Lista de pasajeros</h2>
      <ul className="list-group">
        {pasajeros.map((p) => (
          <li key={p.id} className="list-group-item">
            {p.nombre} {p.apellido} - {p.email ?? 'sin email'}
          </li>
        ))}
      </ul>
    </div>
  );
}
