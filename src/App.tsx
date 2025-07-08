import { SalesList } from './components/list-sales';
import { StatusDashboard } from './components/status-dashboard';

function App() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="bg-gray-800 text-white p-4 rounded-md">
        <h1 className="text-2xl font-bold">Dashboard de Vendas</h1>
      </header>

      <main className="space-y-8">        
        {/* Dashboard de status */}
        <StatusDashboard/>

        {/* Lista de pedidos */}
        <SalesList/>
      </main>
    </div>
  );
}

export default App;