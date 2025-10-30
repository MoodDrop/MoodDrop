interface FlagToggleProps {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function FlagToggle({ label, description, enabled, onChange }: FlagToggleProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
      <div className="flex-1">
        <p className="font-medium text-stone-800">{label}</p>
        {description && <p className="text-sm text-stone-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 ${
          enabled ? "bg-rose-400" : "bg-stone-300"
        }`}
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        data-testid={`toggle-${label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
