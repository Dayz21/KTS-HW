import React from 'react';

export type UseListboxOptions = {
  itemCount: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
  disabled?: boolean;
};

export const useListbox = ({
  itemCount,
  selectedIndex,
  onSelect,
  disabled = false,
}: UseListboxOptions) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const resetFocus = () => setFocusedIndex(-1);

  const close = React.useCallback((returnFocus = true) => {
    setIsOpen(false);
    resetFocus();

    if (returnFocus) {
      triggerRef.current?.focus();
    }
  }, []);

  const open = React.useCallback(() => {
    if (disabled || itemCount === 0) {
      return;
    }

    setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  }, [disabled, itemCount, selectedIndex]);

  const toggle = React.useCallback(() => {
    if (disabled) {
      return;
    }

    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [disabled, isOpen, close, open]);

  const select = React.useCallback(
    (index: number) => {
      onSelect(index);
      close();
    },
    [onSelect, close],
  );

  const getItemRef = React.useCallback((index: number) => {
    return (element: HTMLButtonElement | null) => {
      itemRefs.current[index] = element;
    };
  }, []);

  React.useEffect(() => {
    if (!isOpen || focusedIndex < 0) {
      return;
    }

    itemRefs.current[focusedIndex]?.focus();
  }, [isOpen, focusedIndex]);

  React.useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        resetFocus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  const onTriggerKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp':
        case 'Enter':
        case ' ':
          event.preventDefault();

          if (!isOpen) {
            open();
          }

          break;
        case 'Escape':
          if (isOpen) {
            event.preventDefault();
            close();
          }

          break;
      }
    },
    [isOpen, open, close],
  );

  const onListKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex((index) => Math.min(index + 1, itemCount - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex((index) => Math.max(index - 1, 0));
          break;
        case 'Home':
          event.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setFocusedIndex(itemCount - 1);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();

          if (focusedIndex >= 0) {
            select(focusedIndex);
          }

          break;
        case 'Escape':
          event.preventDefault();
          close();
          break;
        case 'Tab':
          setIsOpen(false);
          resetFocus();
          break;
      }
    },
    [itemCount, focusedIndex, select, close],
  );

  return {
    isOpen,
    rootRef,
    triggerRef,
    getItemRef,
    toggle,
    select,
    onTriggerKeyDown,
    onListKeyDown,
  };
};
