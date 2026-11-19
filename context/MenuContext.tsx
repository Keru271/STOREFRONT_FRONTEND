'use client';

// ─── Menu Context ────────────────────────────────────────────────────────────
// Provides server-fetched menu data (headerMenu, footerMenu, menus) to all
// client-side template headers, footers, and navigation drawers with 0 delay.

import React, { createContext, useContext } from 'react';
import type { Menu, MenuItem } from '@/lib/api/types';

export interface MenuContextValue {
  headerMenu: Menu | null;
  footerMenu: Menu | null;
  mobileMenu: Menu | null;
  menus: Menu[];
  getHeaderItems: () => MenuItem[];
  getFooterItems: () => MenuItem[];
  getMobileItems: () => MenuItem[];
}

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({
  headerMenu = null,
  footerMenu = null,
  mobileMenu = null,
  menus = [],
  children,
}: {
  headerMenu?: Menu | null;
  footerMenu?: Menu | null;
  mobileMenu?: Menu | null;
  menus?: Menu[];
  children: React.ReactNode;
}) {
  const getHeaderItems = () => headerMenu?.items || [];
  const getFooterItems = () => footerMenu?.items || [];
  const getMobileItems = () =>
    mobileMenu?.items && mobileMenu.items.length > 0
      ? mobileMenu.items
      : headerMenu?.items || [];

  return (
    <MenuContext.Provider
      value={{
        headerMenu,
        footerMenu,
        mobileMenu,
        menus,
        getHeaderItems,
        getFooterItems,
        getMobileItems,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  return useContext(MenuContext);
}
