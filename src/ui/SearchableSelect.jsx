import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const SearchableSelect = ({
  label,
  placeholder = "Select option",
  items = [],
  selectedId = "",
  onSelect,
  onSearch,
  helperText,
  emptyText = "No results found",
  loading = false,
  required = false,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId),
    [items, selectedId]
  );

  useEffect(() => {
    if (selectedItem) {
      setQuery(selectedItem.label);
    } else if (!isOpen) {
      setQuery("");
    }
  }, [selectedItem, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        if (selectedItem) {
          setQuery(selectedItem.label);
        } else {
          setQuery("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, selectedItem]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => {
      const labelMatch = item.label
        ?.toLowerCase()
        .includes(normalizedQuery);
      const subLabelMatch = item.subLabel
        ?.toLowerCase()
        .includes(normalizedQuery);
      return labelMatch || subLabelMatch;
    });
  }, [items, query]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    onSearch?.(value);
    setIsOpen(true);
  };

  const handleSelect = (item) => {
    setQuery(item.label);
    onSelect?.(item.id, item);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    onSelect?.("");
    onSearch?.("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="mt-2 relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-md border border-gray-300 p-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-8 flex items-center px-2 text-gray-400 hover:text-gray-600"
            aria-label="Clear selection"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
        <ChevronUpDownIcon className="pointer-events-none absolute inset-y-0 right-2 my-auto h-5 w-5 text-gray-400" />
      </div>

      {helperText && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}

      {isOpen && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <ul className="max-h-60 overflow-auto text-sm">
            {loading ? (
              <li className="px-4 py-3 text-gray-500">Loading...</li>
            ) : filteredItems.length === 0 ? (
              <li className="px-4 py-3 text-gray-500">{emptyText}</li>
            ) : (
              filteredItems.map((item) => (
                <li
                  key={item.id}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    handleSelect(item);
                  }}
                  className={`cursor-pointer px-4 py-2 hover:bg-green-50 ${
                    item.id === selectedId
                      ? "bg-green-100 text-green-700"
                      : "text-gray-700"
                  }`}
                >
                  <div className="font-medium">{item.label}</div>
                  {item.subLabel && (
                    <div className="text-xs text-gray-500">
                      {item.subLabel}
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;



