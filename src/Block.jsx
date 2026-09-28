import { useEffect, useState } from 'react';

export default function Block({ blocknum, provider }) {
  const [open, setOpen] = useState(false);
  const [block, setBlock] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setBlock(null);
    setError('');

    provider.getBlock(blocknum)
      .then((result) => {
        if (cancelled) return;
        if (!result) {
          setError('Блок не найден.');
        } else {
          setBlock(result);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Не удалось загрузить блок.');
      });

    return () => { cancelled = true; };
  }, [blocknum, provider]);

  return (
    <div className="block">
      <button className="block-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span>Блок #{blocknum}</span>
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="block-details">
          {error && <p className="error" role="alert">{error}</p>}
          {!error && !block && <p className="muted">Загрузка блока…</p>}
          {block && (
            <dl>
              <dt>Хеш блока</dt><dd>{block.hash}</dd>
              <dt>Хеш родителя</dt><dd>{block.parentHash}</dd>
              <dt>Количество транзакций</dt><dd>{block.transactions.length}</dd>
            </dl>
          )}
        </div>
      )}
    </div>
  );
}
