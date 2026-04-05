import './App.css';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import { useApp } from './context/AppContext';
import InsightsPanel from './components/dashboard/InsightsPanel';
import TransactionsTable from './components/dashboard/TransactionsTable';

function PageRouter() {
  const { activePage } = useApp();
  if (activePage === "Analytics")    return  <InsightsPanel />;
  if (activePage === "Transactions") return <TransactionsTable />;
  return <Dashboard />;
}

function App() {
  return (
    <Layout>
      <PageRouter />
    </Layout>
  );
}

export default App;