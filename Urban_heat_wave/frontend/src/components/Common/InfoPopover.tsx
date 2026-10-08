import React, { useState, useRef, useEffect } from 'react';
import { Info, X, Clock, Database, Sparkles } from 'lucide-react';
import { METRIC_TOOLTIPS, type MetricQuickTooltip } from '../../constants/scienceContent';

interface InfoPopoverProps {
  metricKey: keyof typeof METRIC_TOOLTIPS;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const InfoPopover: React.FC<InfoPopoverProps> = ({
  metricKey,
  label,
  size = 'sm',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const info: MetricQuickTooltip | undefined = METRIC_TOOLTIPS[metricKey];

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Esc key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!info) return null;

  const iconSizeClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className={`inline-flex items-center gap-1.5 relative ${className}`} ref={popoverRef}>
      {label && <span className="text-xs font-medium text-slate-300">{label}</span>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-slate-400 hover:text-sky-400 transition-colors p-0.5 rounded-full hover:bg-slate-800/60 outline-none focus:ring-1 focus:ring-sky-500/50"
        title={`Explore science behind ${info.title}`}
        aria-label={`Scientific definition for ${info.title}`}
      >
        <Info className={`${iconSizeClass} shrink-0`} />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 w-72 md:w-80 glass-panel p-4 rounded-xl border border-sky-500/30 shadow-2xl z-50 animate-fadeIn text-slate-200 text-xs space-y-2.5 backdrop-blur-xl">
          <div className="flex items-start justify-between border-b border-slate-800 pb-2">
            <h4 className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              {info.title}
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            {info.shortDef}
          </p>

          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 space-y-1 text-[10px] text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                Frequency:
              </span>
              <strong className="text-slate-200 font-mono">{info.updateFrequency}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Database className="w-3 h-3 text-sky-400" />
                Provider:
              </span>
              <strong className="text-slate-200 font-mono">{info.sourceName}</strong>
            </div>
          </div>

          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-[10px] text-amber-300 leading-normal">
            💡 <strong>Science Tip:</strong> {info.scienceTip}
          </div>
        </div>
      )}
    </div>
  );
};
