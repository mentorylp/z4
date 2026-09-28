import { useEffect, useState } from 'react';
import Block from './Block.jsx';

export default function BlockExplorer({ provider }) {
  const [blockNumber, setBlockNumber] = useState(null);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError('');
    provider.getBlockNumber()
      .then((number) => { if (!cancelled) setBlockNumber(number); })
      .catch(() => { if (!cancelled) setError('Не удалось получить номер последнего блока.'); });
    return () => { cancelled = true; };
  }, [provider, refresh]);

  return (
    <section className="card" aria-labelledby="blocks-title">
      <div className="section-heading">
        <div>
          <div className="eyebrow">Задание 1</div>
          <h2 id="blocks-title">Последние блоки</h2>
        </div>
        <button className="small-button" type="button" onClick={() => setRefresh((value) => value + 1)}>Обновить</button>
      </div>
      <p className="muted">Откройте блок, чтобы увидеть его хеши и число транзакций.</p>
      {error && <p className="error" role="alert">{error}</p>}
      {blockNumber === null && !error && <p className="muted">Получение блоков…</p>}
      {blockNumber !== null && Array.from({ length: Math.min(3, blockNumber + 1) }, (_, index) => (
        <Block key={blockNumber - index} blocknum={blockNumber - index} provider={provider} />
      ))}
    </section>
  );
}
