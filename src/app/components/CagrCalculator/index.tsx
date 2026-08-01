'use client';
import { useMemo, useState } from 'react';

const CagrCalculator = () => {
  const [initialValue, setInitialValue] = useState('100000');
  const [currentValue, setCurrentValue] = useState('180000');
  const [years, setYears] = useState('5');

  const result = useMemo(() => {
    const initial = Number(initialValue);
    const current = Number(currentValue);
    const duration = Number(years);

    if (!initialValue || !currentValue || !years) {
      return { cagr: null, error: '' };
    }
    if (initial <= 0 || current <= 0 || duration <= 0) {
      return { cagr: null, error: 'Enter values greater than zero.' };
    }

    return {
      cagr: (Math.pow(current / initial, 1 / duration) - 1) * 100,
      error: '',
    };
  }, [currentValue, initialValue, years]);

  const reset = () => {
    setInitialValue('100000');
    setCurrentValue('180000');
    setYears('5');
  };

  const fields = [
    {
      id: 'cagr-initial-value',
      label: 'Initial value',
      value: initialValue,
      setValue: setInitialValue,
      placeholder: '100000',
    },
    {
      id: 'cagr-current-value',
      label: 'Current value',
      value: currentValue,
      setValue: setCurrentValue,
      placeholder: '180000',
    },
    {
      id: 'cagr-years',
      label: 'Number of years',
      value: years,
      setValue: setYears,
      placeholder: '5',
    },
  ];

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-zinc-950 via-zinc-900 to-rose-950 p-5 sm:p-8">
      <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center">
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-300 font-[family-name:var(--font-inter)]">
            Investment growth
          </p>
          <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-inter)]">
            Calculate your CAGR
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
            CAGR is the smooth annual growth rate that takes an investment from
            its initial value to its current value.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {fields.map((field) => (
            <label
              key={field.id}
              htmlFor={field.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <span className="mb-2 block text-xs font-medium text-zinc-300 font-[family-name:var(--font-inter)]">
                {field.label}
              </span>
              <input
                id={field.id}
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={field.value}
                onChange={(event) => field.setValue(event.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-transparent text-lg font-semibold text-white outline-none placeholder:text-zinc-600"
              />
            </label>
          ))}
        </div>

        <div className="mt-5 rounded-3xl border border-rose-400/20 bg-gradient-to-br from-rose-500/20 to-pink-500/5 p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-200 font-[family-name:var(--font-inter)]">
                Compound annual growth rate
              </p>
              <p className="mt-2 text-4xl font-bold text-white sm:text-5xl font-[family-name:var(--font-inter)]">
                {result.cagr == null ? '—' : `${result.cagr.toFixed(2)}%`}
              </p>
              {result.error ? (
                <p className="mt-2 text-sm text-rose-300">{result.error}</p>
              ) : (
                <p className="mt-2 text-sm text-zinc-400">
                  Per year, compounded over {years || '—'} years
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/15 font-[family-name:var(--font-inter)]"
            >
              Reset example
            </button>
          </div>
        </div>

        <p className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-xs text-zinc-400">
          CAGR = ((Current value / Initial value)<sup>1 / years</sup> - 1) × 100
        </p>
      </div>
    </div>
  );
};

export default CagrCalculator;
