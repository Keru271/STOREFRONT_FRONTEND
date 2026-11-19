'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import {
  COUNTRY_DIAL_CODES,
  CountryDialCode,
  parsePhoneNumber,
} from '@/lib/countryCodes';

export interface PhoneInputWithCountryProps {
  value: string;
  onChange: (fullNumber: string, meta: { dialCode: string; nationalNumber: string; countryCode: string }) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  defaultCountryCode?: string;
}

export const PhoneInputWithCountry: React.FC<PhoneInputWithCountryProps> = ({
  value,
  onChange,
  onBlur,
  name = 'phone',
  id,
  label,
  placeholder = '98765 43210',
  error,
  disabled = false,
  required = false,
  className = '',
  defaultCountryCode = '+91',
}) => {
  const parsed = useMemo(() => {
    return parsePhoneNumber(value, defaultCountryCode);
  }, [value, defaultCountryCode]);

  const [selectedCountry, setSelectedCountry] = useState<CountryDialCode>(parsed.country);
  const [nationalNumber, setNationalNumber] = useState<string>(parsed.nationalNumber);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updated = parsePhoneNumber(value, selectedCountry.dialCode);
    setSelectedCountry(updated.country);
    setNationalNumber(updated.nationalNumber);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return COUNTRY_DIAL_CODES;
    return COUNTRY_DIAL_CODES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleCountrySelect = (country: CountryDialCode) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery('');

    const full = nationalNumber.trim() ? `${country.dialCode} ${nationalNumber.trim()}` : '';
    onChange(full, {
      dialCode: country.dialCode,
      nationalNumber: nationalNumber.trim(),
      countryCode: country.code,
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;

    if (rawVal.trim().startsWith('+')) {
      const parsedPaste = parsePhoneNumber(rawVal.trim());
      setSelectedCountry(parsedPaste.country);
      setNationalNumber(parsedPaste.nationalNumber);

      const full = parsedPaste.nationalNumber.trim()
        ? `${parsedPaste.country.dialCode} ${parsedPaste.nationalNumber.trim()}`
        : '';
      onChange(full, {
        dialCode: parsedPaste.country.dialCode,
        nationalNumber: parsedPaste.nationalNumber.trim(),
        countryCode: parsedPaste.country.code,
      });
      return;
    }

    const cleanNumber = rawVal.replace(/[^\d\s-]/g, '');
    setNationalNumber(cleanNumber);

    const full = cleanNumber.trim() ? `${selectedCountry.dialCode} ${cleanNumber.trim()}` : '';
    onChange(full, {
      dialCode: selectedCountry.dialCode,
      nationalNumber: cleanNumber.trim(),
      countryCode: selectedCountry.code,
    });
  };

  return (
    <div className={`space-y-1.5 ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-200">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div
        className={`relative flex items-center rounded-xl border bg-white dark:bg-neutral-900 transition-all ${
          error
            ? 'border-rose-500 ring-1 ring-rose-500'
            : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white focus-within:border-transparent'
        }`}
      >
        {/* Country Code Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-l-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors border-r border-neutral-300 dark:border-neutral-700 shrink-0 text-neutral-800 dark:text-neutral-200 text-xs font-semibold cursor-pointer select-none"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="text-base leading-none">{selectedCountry.flag}</span>
          <span className="font-mono text-xs font-bold">{selectedCountry.dialCode}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* National Number Input */}
        <input
          id={id || name}
          name={name}
          type="tel"
          disabled={disabled}
          placeholder={placeholder}
          value={nationalNumber}
          onChange={handleNumberChange}
          onBlur={onBlur}
          required={required}
          className="w-full px-3.5 py-2.5 rounded-r-xl bg-transparent text-xs sm:text-sm font-mono font-semibold text-neutral-900 dark:text-white outline-none placeholder:text-neutral-400"
        />

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 top-full mt-2 w-80 max-w-[95vw] z-50 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="p-2.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search country name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-neutral-900 dark:text-white outline-none placeholder:text-neutral-400"
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-700">
              {filteredCountries.length === 0 ? (
                <div className="py-6 text-center text-xs text-neutral-400">No matching countries found</div>
              ) : (
                filteredCountries.map((c) => {
                  const isSelected = c.code === selectedCountry.code;
                  return (
                    <button
                      key={`${c.code}-${c.dialCode}`}
                      type="button"
                      onClick={() => handleCountrySelect(c)}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-bold'
                          : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-700 dark:text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-base leading-none">{c.flag}</span>
                        <span className="truncate">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-xs text-neutral-400">{c.dialCode}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-[11px] font-medium text-rose-500 mt-1">{error}</p>}
    </div>
  );
};
