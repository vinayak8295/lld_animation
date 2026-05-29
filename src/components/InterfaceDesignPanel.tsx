import type { LldInterfaceScene } from "../engine/sceneTypes";

type Props = {
  scene: LldInterfaceScene;
};

export function InterfaceDesignPanel({ scene }: Props) {
  return (
    <div className="contract-grid">
      {scene.interfaces.slice(0, 4).map((contract) => (
        <article className="contract-card" key={contract.name}>
          <span>interface</span>
          <h3>{contract.name}</h3>
          <p>{contract.responsibility}</p>
          <ul>
            {contract.methods.slice(0, 4).map((method) => (
              <li key={method}>{method}</li>
            ))}
          </ul>
          {contract.implementedBy?.length ? <small>Implemented by {contract.implementedBy.join(", ")}</small> : null}
        </article>
      ))}
    </div>
  );
}
