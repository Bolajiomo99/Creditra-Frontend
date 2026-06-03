import { useId } from 'react';
import './AccessibleTooltip.css';

interface AccessibleTooltipProps {
  label: string;
}

export function AccessibleTooltip({ label }: AccessibleTooltipProps) {
  const tooltipId = useId();

  return (
    <span className="accessible-tooltip">
      <span
        tabIndex={0}
        className="accessible-tooltip__trigger"
        aria-label="More information"
        aria-describedby={tooltipId}
      >
        <span aria-hidden="true">i</span>
      </span>
      <span id={tooltipId} role="tooltip" className="accessible-tooltip__content">
        {label}
      </span>
    </span>
  );
}
