import { useState, useEffect, useRef, useCallback } from 'react';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
}

const FilterBar = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
}: FilterBarProps) => {
  const [inputValue, setInputValue] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local input when parent resets search externally
  useEffect(() => {
    setInputValue(search);
  }, [search]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearchChange(value);
      }, 400);
    },
    [onSearchChange]
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onCategoryChange(e.target.value);
    },
    [onCategoryChange]
  );

  const handleClear = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setInputValue('');
    onSearchChange('');
    onCategoryChange('');
  }, [onSearchChange, onCategoryChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const hasFilters = inputValue !== '' || category !== '';

  return (
    <>
      <style>{`
        .filter-bar {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 12px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        .filter-bar__input,
        .filter-bar__select {
          width: 100%;
          padding: 9px 12px;
          font-size: 14px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          outline: none;
          box-sizing: border-box;
          background: #f9fafb;
          color: #111;
          transition: border-color 0.15s;
        }
        .filter-bar__input:focus,
        .filter-bar__select:focus {
          border-color: var(--color-primary);
          background: #fff;
        }
        .filter-bar__clear {
          padding: 9px 16px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          background: var(--color-primary);
          color: var(--color-white);
          cursor: pointer;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .filter-bar__clear:hover {
          background: var(--color-primary-dark);
        }
        .filter-bar__clear:disabled {
          opacity: 0.4;
          cursor: default;
        }
        @media (min-width: 640px) {
          .filter-bar {
            flex-direction: row;
            align-items: center;
          }
          .filter-bar__input {
            flex: 2;
            width: auto;
          }
          .filter-bar__select {
            flex: 1;
            width: auto;
          }
        }
      `}</style>

      <div className="filter-bar">
        <input
          className="filter-bar__input"
          type="text"
          placeholder="Buscar productos..."
          value={inputValue}
          onChange={handleSearchChange}
          aria-label="Buscar productos"
        />

        <select
          className="filter-bar__select"
          value={category}
          onChange={handleCategoryChange}
          aria-label="Filtrar por categoría"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          className="filter-bar__clear"
          onClick={handleClear}
          disabled={!hasFilters}
          type="button"
        >
          Limpiar filtros
        </button>
      </div>
    </>
  );
};

export default FilterBar;
