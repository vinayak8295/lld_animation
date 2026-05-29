import { mentionedToken } from "../engine/visualSemantics";
import type { LldMethodScene } from "../engine/sceneTypes";

type Props = {
  scene: LldMethodScene;
};

export function MethodContractsPanel({ scene }: Props) {
  return (
    <div className="method-contracts">
      {scene.methods.slice(0, 8).map((method) => {
        const active = mentionedToken(scene.narration, method.owner) || mentionedToken(scene.narration, method.signature);
        return (
          <article className={`method-card ${active ? "active" : ""}`} key={`${method.owner}-${method.signature}`}>
            <div>
              <span>{method.owner}</span>
              <h3>{method.signature}</h3>
            </div>
            <p>{method.purpose}</p>
            <small>{method.output}</small>
          </article>
        );
      })}
    </div>
  );
}
