'use client';

import * as RadixTooltip from '@radix-ui/react-tooltip';

export function TooltipProvider({ children, delayDuration = 100 }) {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      {children}
    </RadixTooltip.Provider>
  );
}

/**
 * Convenience wrapper. Usage:
 *   <Tooltip content="Click to expand">
 *     <button>Hover me</button>
 *   </Tooltip>
 *
 * If you have many tooltips in one tree, wrap once with <TooltipProvider>.
 */
export default function Tooltip({ children, content, side = 'top', sideOffset = 6 }) {
  if (!content) return children;

  return (
    <RadixTooltip.Provider delayDuration={100}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={sideOffset}
            className="bg-[var(--bg-card)] border border-[var(--border)] px-3 py-1.5 rounded text-xs text-[var(--text-primary)] shadow-xl z-50 max-w-xs"
          >
            {content}
            <RadixTooltip.Arrow className="fill-[var(--border)]" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
