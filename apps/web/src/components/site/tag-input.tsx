import { useState } from "react";
import { X } from "lucide-react";

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter",
  max = 20,
  suggestions,
}: {
  value: Array<string>;
  onChange: (v: Array<string>) => void;
  placeholder?: string;
  max?: number;
  suggestions?: Array<string>;
}) {
  const [text, setText] = useState("");
  const add = (t: string) => {
    const v = t.trim();
    if (v && !value.includes(v) && value.length < max) onChange([...value, v]);
    setText("");
  };
  return (
    <div>
      <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-input bg-white p-1.5">
        {value.map((s) => (
          <span key={s} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
            {s}
            <button type="button" onClick={() => onChange(value.filter((x) => x !== s))} aria-label={`Remove ${s}`}>
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(text);
            } else if (e.key === "Backspace" && !text && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => text && add(text)}
          placeholder={value.length ? "" : placeholder}
          className="min-w-32 flex-1 bg-transparent px-1 text-sm outline-none"
        />
      </div>
      {suggestions && suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions
            .filter((s) => !value.includes(s))
            .map((s) => (
              <button key={s} type="button" onClick={() => add(s)} className="rounded-full border border-dashed px-2.5 py-0.5 text-xs text-muted-foreground hover:border-primary hover:text-primary">
                + {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
