"use client";

export default function ReaderSettings({ prefs, setPref }) {
  const { size, mode, width, font } = prefs;

  return (
    <div className="flex flex-wrap items-center gap-y-3 gap-x-4" role="region" aria-label="Reader settings">
      <Control
        label="Size"
        name="size"
        value={size}
        options={[
          ['S','Small'],
          ['M','Medium'],
          ['L','Large'],
        ]}
        onChange={(v) => setPref('size', v)}
      />

      <Control
        label="Mode"
        name="mode"
        value={mode}
        options={[
          ['light','Light'],
          ['sepia','Sepia'],
          ['dark','Dark'],
          ['paper','Paper'],
        ]}
        onChange={(v) => setPref('mode', v)}
      />

      <Control
        label="Width"
        name="width"
        value={width}
        options={[
          ['S','Narrow'],
          ['M','Normal'],
          ['L','Wide'],
        ]}
        onChange={(v) => setPref('width', v)}
      />

      <Control
        label="Font"
        name="font"
        value={font}
        options={[
          ['serif','Serif'],
          ['sans','Sans-serif'],
          ['dyslexic','Dyslexic'],
        ]}
        onChange={(v) => setPref('font', v)}
      />
    </div>
  );
}

function Control({ label, name, value, options, onChange }) {
  return (
    <fieldset className="m-0 p-0 border-0">
      <legend className="text-sm text-neutral-600 mb-1">{label}</legend>
      <div className="inline-flex gap-2" role="radiogroup" aria-label={label}>
        {options.map(([val, text]) => {
          const active = value === val;
          return (
          <button
            key={val}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(val)}
            className={[
              "rounded-full px-3 py-1 text-sm border transition-colors",
              active 
              ? "border-[color:var(--ring)] bg-[color:color-mix(in oklab,var(--ring)_15%,transparent)]" 
              : "border-[color:color-mix(in oklab,var(--fg)_25%,transparent)] bg-[color:color-mix(in oklab,var(--fg)_5%,transparent)] hover:bg-[color:color-mix(in oklab,var(--fg)_10%,transparent)]"
            ].join(" ")}
          >
            {text}
          </button>
          );
        })}
      </div>
    </fieldset>
  );
}
