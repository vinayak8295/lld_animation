import type { LldCodeScene } from "../engine/sceneTypes";

type Props = {
  scene: LldCodeScene;
  progress: number;
};

export function CodeTypingPanel({ scene, progress }: Props) {
  const visibleChars = Math.max(1, Math.floor(scene.code.length * progress));
  const typedCode = scene.code.slice(0, visibleChars);
  const lines = typedCode.split("\n");
  const visibleLines = lines.slice(Math.max(0, lines.length - 18));

  return (
    <div className="code-panel">
      <div className="code-tab">
        <span>{scene.filename}</span>
        <small>{scene.language}</small>
      </div>
      <pre>
        <code>
          {visibleLines.map((line, index) => (
            <span className={classifyLine(line)} key={`${index}-${line}`}>
              {line || " "}
              {"\n"}
            </span>
          ))}
          <span className="cursor" />
        </code>
      </pre>
    </div>
  );
}

function classifyLine(line: string) {
  if (/^\s*(class|abstract class|enum|interface)\b/.test(line)) return "code-type";
  if (/^\s*(public|private|protected)\b/.test(line)) return "code-member";
  if (line.includes("throw new")) return "code-warning";
  if (line.trim().startsWith("//")) return "code-comment";
  return "";
}
