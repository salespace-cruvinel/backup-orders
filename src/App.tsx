import { SalesList } from './components/list-sales';
import { StatusDashboard } from './components/status-dashboard';

function App() {
  return (
    <div className='container mx-auto p-3'>
      <header>
        <h1 className='font-bold text-3xl'>Dashboard de Vendas</h1>
      </header>

      <main>        
        {/* Dashboard de status */}
        <StatusDashboard/>

        {/* Lista de pedidos */}
        <SalesList/>
      </main>
    </div>
  );
}

export default App;