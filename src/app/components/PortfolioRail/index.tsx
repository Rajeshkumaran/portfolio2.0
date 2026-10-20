'use client';
import { Children, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/app/lib/hooks';

const PortfolioRail = ({
  label,
  itemType,
  children,
}: {
  label: string;
  itemType: string;
  children: ReactNode;
}) => {
  const railRef = useRef<HTMLUListElement>(null);
  const railId = useId();
  const reduced = usePrefersReducedMotion();
  const items = Children.toArray(children);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const update = () => {
      setCanPrevious(rail.scrollLeft > 1);
      setCanNext(rail.scrollWidth - rail.clientWidth - rail.scrollLeft > 1);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    rail.addEventListener('scroll', update, { passive: true });
    return () => {
      observer.disconnect();
      rail.removeEventListener('scroll', update);
    };
  }, [items.length]);

  const move = (direction: number) => {
    const rail = railRef.current;
    const card = rail?.firstElementChild;
    if (!rail || !card) return;
    rail.scrollBy({
      left: direction * card.getBoundingClientRect().width,
      behavior: reduced ? 'instant' : 'smooth',
    });
  };

  return (
    <div className={`portfolio-rail${items.length === 1 ? ' portfolio-rail--single' : ''}`}>
      <ul
        id={railId}
        ref={railRef}
        className="portfolio-rail-list"
        aria-label={`${label} cards`}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            move(event.key === 'ArrowLeft' ? -1 : 1);
          } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            event.currentTarget.scrollTo({
              left: event.key === 'Home' ? 0 : event.currentTarget.scrollWidth,
              behavior: reduced ? 'instant' : 'smooth',
            });
          }
        }}
      >
        {items.map((item, index) => (
          <li key={index} className="portfolio-rail-item">
            {item}
          </li>
        ))}
      </ul>
      <div className="portfolio-rail-footer">
        <p className="portfolio-eyebrow">
          {String(items.length).padStart(2, '0')} {itemType}
          {(canPrevious || canNext) && <span> / Scroll to explore</span>}
        </p>
        {(canPrevious || canNext) && (
          <div className="portfolio-rail-controls">
            <button
              type="button"
              aria-label={`Previous ${label.toLowerCase()} card`}
              aria-controls={railId}
              disabled={!canPrevious}
              onClick={() => move(-1)}
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <button
              type="button"
              aria-label={`Next ${label.toLowerCase()} card`}
              aria-controls={railId}
              disabled={!canNext}
              onClick={() => move(1)}
            >
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioRail;
