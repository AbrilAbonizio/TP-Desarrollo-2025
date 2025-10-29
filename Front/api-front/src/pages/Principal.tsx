import NavBar from '../components/NavBar.tsx';
import GeneralCard from '../components/GeneralCard.tsx';
import PrimaryButton from '../components/PrimaryButton.tsx';

const cards = [
  {
    title: 'Pasajeros',
    text: 'Visualiza y administra los datos de todos los pasajeros registrados',
    img: '/pasajero.jpg',
  },
  {
    title: 'Viajes',
    text: 'Consulta y administra los viajes disponibles',
    img: '/viaje.jpg',
  },
  {
    title: 'Ciudades',
    text: 'Explora y administra las ciudades de destino',
    img: '/ciudades.jpg',
  },
  {
    title: 'Categorias',
    text: 'Organiza los viajes por categorías',
    img: '/categorias.jpg',
  },
];

export default function Principal() {
  return (
    <>
      <NavBar />
      <div className="container mt-5 pt-5">
        <div className="row g-5">
          {cards.map((c, i) => (
            <div className="col-sm-6 col-md-3 mb-4" key={i}>
              <GeneralCard title={c.title} text={c.text} img={c.img}>
                <PrimaryButton texto="Ver más" />
              </GeneralCard>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
