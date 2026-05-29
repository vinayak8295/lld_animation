type Props = {
  value: string;
  onChange: (value: string) => void;
  errors: string[];
};

export function JsonInputPanel({ value, onChange, errors }: Props) {
  return (
    <section className="panel json-panel">
      <div className="panel-title-row">
        <h2>LLD JSON</h2>
        <span>{errors.length ? `${errors.length} issue${errors.length === 1 ? "" : "s"}` : "Valid shape"}</span>
      </div>
      <textarea
        aria-label="LLD JSON editor"
        spellCheck={false}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {errors.length > 0 && (
        <div className="validation-list">
          {errors.map((error) => (
            <div key={error}>{error}</div>
          ))}
        </div>
      )}
    </section>
  );
}
