import { useEffect, useMemo, useState } from 'react';
import { Contract, formatUnits, isAddress } from 'ethers';

// Circle USDC в Ethereum Sepolia; проверенный контракт в Etherscan.
const tokenAddress = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
const abi = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
];

export default function Erc20Reader({ provider }) {
  const contract = useMemo(() => new Contract(tokenAddress, abi, provider), [provider]);
  const [token, setToken] = useState(null);
  const [tokenError, setTokenError] = useState('');
  const [address, setAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState(null);
  const [balanceError, setBalanceError] = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([contract.name(), contract.symbol(), contract.decimals(), contract.totalSupply()])
      .then(([name, symbol, decimals, totalSupply]) => {
        if (!cancelled) setToken({ name, symbol, decimals, totalSupply: formatUnits(totalSupply, decimals) });
      })
      .catch(() => { if (!cancelled) setTokenError('Не удалось прочитать контракт. Проверьте доступность RPC Sepolia.'); });
    return () => { cancelled = true; };
  }, [contract]);

  async function readBalance(event) {
    event.preventDefault();
    setBalanceError('');
    setAccountBalance(null);
    const owner = address.trim();
    if (!isAddress(owner)) {
      setBalanceError('Введите корректный адрес Ethereum.');
      return;
    }
    setChecking(true);
    try {
      const decimals = token?.decimals ?? await contract.decimals();
      const value = await contract.balanceOf(owner);
      setAccountBalance(formatUnits(value, decimals));
    } catch {
      setBalanceError('Не удалось получить баланс токена.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <section className="card" aria-labelledby="token-title">
      <div className="eyebrow">Задание 2</div>
      <h2 id="token-title">Контракт ERC‑20</h2>
      <p className="muted">Тестовый USDC в сети Ethereum Sepolia.</p>
      <a className="address-link" href={`https://sepolia.etherscan.io/address/${tokenAddress}#code`} target="_blank" rel="noreferrer">{tokenAddress}</a>

      {tokenError && <p className="error" role="alert">{tokenError}</p>}
      {!token && !tokenError && <p className="muted">Чтение публичных методов…</p>}
      {token && (
        <dl className="token-data">
          <dt>name()</dt><dd>{token.name}</dd>
          <dt>symbol()</dt><dd>{token.symbol}</dd>
          <dt>decimals()</dt><dd>{token.decimals.toString()}</dd>
          <dt>totalSupply()</dt><dd>{token.totalSupply} {token.symbol}</dd>
        </dl>
      )}

      <form className="balance-form" onSubmit={readBalance}>
        <label htmlFor="token-account">balanceOf(address)</label>
        <div className="input-row">
          <input id="token-account" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="0x… адрес аккаунта" spellCheck="false" />
          <button type="submit" disabled={checking}>{checking ? 'Чтение…' : 'Проверить'}</button>
        </div>
      </form>
      {balanceError && <p className="error" role="alert">{balanceError}</p>}
      {accountBalance !== null && <p className="result">Баланс: <strong>{accountBalance} {token?.symbol ?? 'USDC'}</strong></p>}
    </section>
  );
}
