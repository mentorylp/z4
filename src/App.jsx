import { JsonRpcProvider } from 'ethers';
import BalanceReader from './BalanceReader.jsx';
import BlockExplorer from './BlockExplorer.jsx';
import Erc20Reader from './Erc20Reader.jsx';
import './App.css';

const providerUrl = 'https://ethereum-sepolia-rpc.publicnode.com';
const provider = new JsonRpcProvider(providerUrl, 11155111);

export default function App() {
  return (
    <main className="page">
      <header className="hero">
        <div className="eyebrow">Практическая работа 4 · Ethereum Sepolia</div>
        <h1>Обозреватель блоков и ERC‑20</h1>
        <p>Данные читаются напрямую из тестовой сети через ethers.js 6.</p>
      </header>

      <div className="grid">
        <BlockExplorer provider={provider} />
        <Erc20Reader provider={provider} />
      </div>

      <BalanceReader provider={provider} />
    </main>
  );
}
