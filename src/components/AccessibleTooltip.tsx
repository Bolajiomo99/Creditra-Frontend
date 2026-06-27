import React, { useState, useRef, useEffect, CSSProperties } from 'react';

/**
 * Simple tooltip hook that returns positioning props.
 * This is a minimal implementation used by AccessiblePopover.
 */
export function useTooltip({
  open,
  setOpen,
  triggerRef,
  popoverRef,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement>;
  popoverRef: React.RefObject<HTMLElement>;
}) {
  const [position, setPosition] = useState<CSSProperties>({});

  useEffect(() => {
    if (open && triggerRef.current && popoverRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popover = popoverRef.current;
      // simple below‑center positioning
      const top = triggerRect.bottom + window.scrollY + 8; // 8px gap
      const left = triggerRect.left + window.scrollX;
      setPosition({ top, left, position: 'absolute' });
    }
  }, [open, triggerRef, popoverRef]);

  const tooltipProps = open
    ? { style: { ...position, zIndex: 1000 } }
    : {};

  // Arrow props placeholder (can be styled later)
  const arrowProps = {};

  return { tooltipProps, arrowProps };
}

/**
 * Basic tooltip component – mainly for legacy usage.
 * It renders children and shows a tooltip when hovered/focused.
 */
export function AccessibleTooltip({
  children,
  content,
  asPopover = false,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  asPopover?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLElement>(null);
  const { tooltipProps } = useTooltip({ open, setOpen, triggerRef, popoverRef });

  const triggerProps = {
    ref: triggerRef,
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
    'aria-describedby': asPopover ? undefined : 'tooltip',
    'aria-haspopup': asPopover ? 'dialog' : 'tooltip',
    role: asPopover ? 'button' : undefined,
  } as any;

  return (
    <>
      <span {...triggerProps}>{children}</span>
      {open && (
        <div
          role={asPopover ? 'dialog' : 'tooltip'}
          id={asPopover ? undefined : 'tooltip'}
          ref={popoverRef as any}
          {...tooltipProps}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md p-3"
        >
          {content}
        </div>
      )}
    </>
  );
}
