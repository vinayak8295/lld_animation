import { FileText, WandSparkles } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  onRegenerate: () => void;
};

export function VoiceoverEditor({ value, onChange, onApply, onRegenerate }: Props) {
  return (
    <section className="panel voiceover-panel">
      <div className="panel-title-row">
        <h2>Voiceover Script</h2>
        <span>Editable narration</span>
      </div>
      <textarea
        aria-label="Voiceover script editor"
        spellCheck={false}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="voiceover-actions">
        <button type="button" onClick={onApply}>
          <FileText size={17} />
          <span>Apply Script</span>
        </button>
        <button type="button" onClick={onRegenerate}>
          <WandSparkles size={17} />
          <span>Regenerate</span>
        </button>
      </div>
    </section>
  );
}
