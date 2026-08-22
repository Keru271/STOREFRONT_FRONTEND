'use client';

import { useState, useEffect } from 'react';
import { getMenu } from '@/lib/api/catalog';
import type { Menu, MenuItem } from '@/lib/api/types';
import { useMenuContext } from '@/context/MenuContext';

export interface UseMenuOptions {
  fallbackItems?: MenuItem[];
}

export function useMenu(handle: string = 'header', options: UseMenuOptions = {}) {
  const menuCtx = useMenuContext();

  // Check if this menu is already pre-fetched on the server side
  const lowerHandle = handle.toLowerCase();
  const isHeader = lowerHandle.includes('header') || lowerHandle.includes('main') || lowerHandle.includes('nav');
  const isFooter = lowerHandle.includes('footer');

  const serverMenu = isHeader
    ? menuCtx?.headerMenu
    : isFooter
    ? menuCtx?.footerMenu
    : menuCtx?.menus.find((m) => m.handle.toLowerCase() === lowerHandle);

  const initialItems = serverMenu?.items && serverMenu.items.length > 0
    ? serverMenu.items
    : options.fallbackItems || [];

  const [menu, setMenu] = useState<Menu | null>(serverMenu || null);
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [isLoading, setIsLoading] = useState<boolean>(!serverMenu);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If we already have the server-rendered menu, we don't need an extra network request
    if (serverMenu && serverMenu.items && serverMenu.items.length > 0) {
      setMenu(serverMenu);
      setItems(serverMenu.items);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    getMenu(handle)
      .then((data) => {
        if (!isMounted) return;
        if (data && data.items && data.items.length > 0) {
          setMenu(data);
          setItems(data.items);
        } else if (options.fallbackItems && options.fallbackItems.length > 0) {
          setItems(options.fallbackItems);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn(`[useMenu] Failed to fetch menu "${handle}":`, err);
        setError(err);
        if (options.fallbackItems) {
          setItems(options.fallbackItems);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [handle, serverMenu]);

  return {
    menu,
    items,
    isLoading,
    error,
  };
}
