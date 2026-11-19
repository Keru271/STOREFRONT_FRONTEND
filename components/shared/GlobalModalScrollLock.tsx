'use client';

import { useEffect } from 'react';

/**
 * Checks if a given HTML element represents an active, visible modal or drawer overlay in the storefront.
 */
function isModalElement(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false;

  // 1. If element or any parent is hidden/invisible, it's not active
  if (el.hidden || el.style.display === 'none' || el.style.visibility === 'hidden') return false;
  if (el.classList.contains('hidden') || el.classList.contains('invisible')) return false;
  if (el.classList.contains('opacity-0') && el.classList.contains('pointer-events-none')) return false;

  // 2. Explicit modal attributes
  if (
    el.getAttribute('data-modal') === 'true' ||
    el.getAttribute('role') === 'dialog' ||
    el.getAttribute('aria-modal') === 'true' ||
    el.classList.contains('modal-overlay') ||
    el.classList.contains('modal-backdrop')
  ) {
    return true;
  }

  // 3. Fixed fullscreen overlay elements with high z-index and backdrop styling
  const cls = el.className;
  if (typeof cls === 'string' && cls.includes('fixed') && cls.includes('inset-0')) {
    const hasElevatedZ =
      cls.includes('z-50') ||
      cls.includes('z-40') ||
      cls.includes('z-[') ||
      cls.includes('z-60');

    const hasBackdrop = cls.includes('bg-') || cls.includes('backdrop-blur');
    const hasChildren = el.children.length > 0;

    if (hasElevatedZ && hasBackdrop && hasChildren) {
      return true;
    }
  }

  return false;
}

/**
 * GlobalModalScrollLock for Storefront
 * Locks window scroll and enforces 100% viewport height coverage when any modal/drawer is open.
 */
export function GlobalModalScrollLock() {
  useEffect(() => {
    let isLocked = false;
    let originalBodyOverflow = '';
    let originalHtmlOverflow = '';
    let originalBodyHeight = '';
    let originalHtmlHeight = '';
    let originalBodyPaddingRight = '';

    const updateScrollLock = () => {
      const allElements = document.querySelectorAll(
        '[role="dialog"], [aria-modal="true"], [data-modal="true"], .modal-overlay, .modal-backdrop, .fixed.inset-0'
      );

      let modalFound = false;
      for (let i = 0; i < allElements.length; i++) {
        if (isModalElement(allElements[i])) {
          modalFound = true;
          break;
        }
      }

      if (modalFound && !isLocked) {
        isLocked = true;
        originalBodyOverflow = document.body.style.overflow;
        originalHtmlOverflow = document.documentElement.style.overflow;
        originalBodyHeight = document.body.style.height;
        originalHtmlHeight = document.documentElement.style.height;
        originalBodyPaddingRight = document.body.style.paddingRight;

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
          document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        document.documentElement.classList.add('modal-open');
        document.body.classList.add('modal-open');
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.height = '100%';
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100%';
      } else if (!modalFound && isLocked) {
        isLocked = false;
        document.documentElement.classList.remove('modal-open');
        document.body.classList.remove('modal-open');
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.documentElement.style.height = originalHtmlHeight;
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.height = originalBodyHeight;
        document.body.style.paddingRight = originalBodyPaddingRight;
      }
    };

    const observer = new MutationObserver(() => {
      updateScrollLock();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'hidden', 'aria-modal', 'data-state'],
    });

    const handleWheel = (e: WheelEvent) => {
      if (!isLocked) return;

      let target = e.target as HTMLElement | null;
      let canScroll = false;

      while (target && target !== document.body && target !== document.documentElement) {
        const style = window.getComputedStyle(target);
        const overflowY = style.overflowY;
        if (
          (overflowY === 'auto' || overflowY === 'scroll') &&
          target.scrollHeight > target.clientHeight
        ) {
          const isScrollingUp = e.deltaY < 0;
          const isScrollingDown = e.deltaY > 0;
          const atTop = target.scrollTop <= 0;
          const atBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 1;

          if ((isScrollingUp && !atTop) || (isScrollingDown && !atBottom)) {
            canScroll = true;
            break;
          }
        }
        target = target.parentElement;
      }

      if (!canScroll) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isLocked) return;

      let target = e.target as HTMLElement | null;
      let canScroll = false;

      while (target && target !== document.body && target !== document.documentElement) {
        const style = window.getComputedStyle(target);
        const overflowY = style.overflowY;
        if (
          (overflowY === 'auto' || overflowY === 'scroll') &&
          target.scrollHeight > target.clientHeight
        ) {
          canScroll = true;
          break;
        }
        target = target.parentElement;
      }

      if (!canScroll) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    updateScrollLock();

    return () => {
      observer.disconnect();
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
      if (isLocked) {
        document.documentElement.classList.remove('modal-open');
        document.body.classList.remove('modal-open');
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.documentElement.style.height = originalHtmlHeight;
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.height = originalBodyHeight;
        document.body.style.paddingRight = originalBodyPaddingRight;
      }
    };
  }, []);

  return null;
}
