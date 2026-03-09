interface OptionButtonProps {
  id: string;
  text: string;
  selected: boolean;
  correct: boolean | null; // null = not yet revealed
  disabled: boolean;
  letter: string;
  onClick: (id: string) => void;
}

export function OptionButton({ id, text, selected, correct, disabled, letter, onClick }: OptionButtonProps) {
  const base =
    'w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1';

  let style: string;
  if (correct === null) {
    // Not yet answered
    style = selected
      ? 'border-primary-500 bg-primary-50 text-primary-900'
      : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50';
  } else if (correct) {
    // This option is correct
    style = 'border-success-500 bg-success-50 text-green-900';
  } else if (selected) {
    // Wrong answer selected
    style = 'border-danger-500 bg-danger-50 text-red-900';
  } else {
    // Unselected and not correct
    style = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
  }

  const letterStyle =
    correct === null && selected
      ? 'bg-primary-600 text-white'
      : correct === true
        ? 'bg-success-500 text-white'
        : correct === false && selected
          ? 'bg-danger-500 text-white'
          : 'bg-slate-100 text-slate-500';

  return (
    <button
      className={[base, style, disabled ? 'cursor-default' : 'cursor-pointer'].join(' ')}
      onClick={() => !disabled && onClick(id)}
      disabled={disabled && correct === null}
      aria-pressed={selected}
    >
      <span
        className={[
          'flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold',
          letterStyle,
        ].join(' ')}
      >
        {correct !== null && correct ? '✓' : correct !== null && selected ? '✗' : letter}
      </span>
      <span className="flex-1 text-sm leading-relaxed pt-0.5">{text}</span>
    </button>
  );
}
