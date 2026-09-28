import { useState } from 'react';
import { formatEther, isAddress } from 'ethers';

export default function BalanceReader({ provider }) {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  async function readBalance(event) {
    event.preventDefault();
    setBalance(null);
    setError('');
    const account = address.trim();
    if (!isAddress(account)) {
      setError('Введите корректный адрес Ethereum.');
      return;
    }
    setChecking(true);
    try {
      setBalance(formatEther(await provider.getBalance(account)));
    } catch {
      setError('Не удалось получить баланс ETH.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <section className="card eth-card" aria-labelledby="balance-title">
      <h2 id="balance-title">Баланс ETH</h2>
      <p className="muted">Дополнительный компонент из практической работы.</p>
      <form className="balance-form" onSubmit={readBalance}>
        <label htmlFor="eth-account">Адрес аккаунта</label>
        <div className="input-row">
          <input id="eth-account" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="0x… адрес аккаунта" spellCheck="false" />
          <button type="submit" disabled={checking}>{checking ? 'Чтение…' : 'Проверить'}</button>
        </div>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
      {balance !== null && <p className="result">Баланс: <strong>{balance} ETH</strong></p>}
    </section>
  );
}
