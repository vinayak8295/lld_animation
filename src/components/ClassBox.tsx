import type { LldEntity } from "../topics/topicTypes";

type Props = {
  entity: LldEntity;
  active?: boolean;
  style: React.CSSProperties;
};

export function ClassBox({ entity, active, style }: Props) {
  return (
    <div className={`class-box ${entity.type} ${active ? "active" : ""}`} style={style}>
      <div className="class-title">
        <span>{entity.type}</span>
        <strong>{entity.name}</strong>
      </div>
      {entity.fields?.length ? (
        <ul>
          {entity.fields.slice(0, 3).map((field) => (
            <li key={field}>- {field}</li>
          ))}
        </ul>
      ) : null}
      {entity.methods?.length ? (
        <ul>
          {entity.methods.slice(0, 3).map((method) => (
            <li key={method}>+ {method}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
