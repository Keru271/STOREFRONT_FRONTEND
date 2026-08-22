'use client';

// ─── Menu Context ────────────────────────────────────────────────────────────
// Provides server-fetched menu data (headerMenu, footerMenu, menus) to all
// client-side template headers, footers, and navigation drawers with 0 delay.

import React, { createContext, useContext } from 'react';
import type { Menu, MenuItem } from '@/lib/api/types';

export interface MenuContextValue {
  headerMenu: Menu | null;
  footerMenu: Menu | null;
  menus: Menu[];
  getHeaderItems: () => MenuItem[];
  getFooterItems: () => MenuItem[];
}

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({
  headerMenu = null,
  footerMenu = null,
  menus = [],
  children,
}: {
  headerMenu?: Menu | null;
  footerMenu?: Menu | null;
  menus?: Menu[];
  children: React.ReactNode;
}) {
  const getHeaderItems = () => headerMenu?.items || [];
  const getFooterItems = () => footerMenu?.items || [];

  return (
    <MenuContext.Provider
      value={{
        headerMenu,
        footerMenu,
        menus,
        getHeaderItems,
        getFooterItems,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  return useContext(MenuContext);
}
