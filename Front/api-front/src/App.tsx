import PrimaryButton from './components/PrimaryButton.tsx';
import Card from './components/Card.tsx';
import BarraNavegacion from './components/BarraNavegacion.tsx';

function App() {
  return (
    <Card>
      <BarraNavegacion></BarraNavegacion>
      <PrimaryButton texto="Ver más"></PrimaryButton>
    </Card>
  );
}

export default App;
