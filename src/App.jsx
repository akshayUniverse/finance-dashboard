import "./App.css";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import { useApp } from "./context/AppContext";
import InsightsPanel from "./components/dashboard/InsightsPanel";
import TransactionsTable from "./components/dashboard/TransactionsTable";

function CurrentPage() {
  const { activePage } = useApp();

  switch (activePage) {
    case "Analytics":
      return <InsightsPanel />;
    case "Transactions":
      return <TransactionsTable />;
    default:
      return <Dashboard />;
  }
}

function App() {
  return (
    <Layout>
      <CurrentPage />
    </Layout>
  );
}

export default App;
