import NavBar from '../components/NavBar.tsx';
import GeneralCard from '../components/GeneralCard.tsx';
import PrimaryButton from '../components/PrimaryButton.tsx';
import { useNavigate } from 'react-router-dom';

export default function Principal() {
  const navigate = useNavigate();

  const handleViajesClick = () => navigate('/viajes');
  const handlePasajerosClick = () => navigate('/pasajeros');
  const handleCiudadesClick = () => navigate('/ciudades');
  const handleCategoriasClick = () => navigate('/categorias');

  const cards = [
    {
      title: 'Pasajeros',
      text: 'Visualiza y administra los datos de todos los pasajeros registrados',
      img: '/pasajero.jpg',
      onClick: handlePasajerosClick,
    },
    {
      title: 'Viajes',
      text: 'Consulta y administra los viajes disponibles',
      img: '/viaje.jpg',
      onClick: handleViajesClick,
    },
    {
      title: 'Ciudades',
      text: 'Explora y administra las ciudades de destino',
      img: '/ciudades.jpg',
      onClick: handleCiudadesClick,
    },
    {
      title: 'Categorias',
      text: 'Organiza los viajes por categorías',
      img: '/categorias.jpg',
      onClick: handleCategoriasClick,
    },
  ];

  return (
    <>
      <NavBar />
      <div className="container mt-5 pt-5">
        <div className="row g-5">
          {cards.map((c, i) => (
            <div className="col-sm-6 col-md-3 mb-4" key={i}>
              <GeneralCard title={c.title} text={c.text} img={c.img}>
                <PrimaryButton texto="Ver más" onClick={c.onClick} />
              </GeneralCard>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
