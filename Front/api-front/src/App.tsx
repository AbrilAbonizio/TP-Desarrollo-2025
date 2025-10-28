import NavBar from './components/NavBar.tsx';
import GeneralCard from './components/GeneralCard.tsx';

const cards = [
  {
    title: 'Pasajeros',
    text: 'Contenido de la primera card',
    img: '/pasajero.jpg',
  },
  { title: 'Viajes', text: 'Contenido de la segunda card' },
  { title: 'Ciudades', text: 'Contenido de la tercera card' },
  { title: 'Categorias', text: 'Contenido de la cuarta card' },
];

export default function App() {
  return (
    <>
      <NavBar />
      <div className="container mt-5 pt-5">
        <div className="row g-5">
          {cards.map((c, i) => (
            <div className="col-sm-6 col-md-3 mb-4" key={i}>
              <GeneralCard title={c.title} text={c.text} img={c.img} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
