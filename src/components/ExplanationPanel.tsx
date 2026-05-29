import type { BaseLldScene } from "../engine/sceneTypes";

type Props = {
  panel: BaseLldScene["rightPanel"];
};

export function ExplanationPanel({ panel }: Props) {
  return (
    <aside className="explanation-panel">
      <div className="panel-kicker">Explanation</div>
      <h2>{panel.heading}</h2>
      {panel.body && <p>{panel.body}</p>}
      {panel.bullets?.length ? (
        <ul>
          {panel.bullets.slice(0, 5).map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
      {panel.interviewNote && (
        <div className="interview-note">
          <span>Interview note</span>
          <p>{panel.interviewNote}</p>
        </div>
      )}
    </aside>
  );
}
