import type { LldTestCaseScene } from "../engine/sceneTypes";

type Props = {
  scene: LldTestCaseScene;
};

export function TestCasePanel({ scene }: Props) {
  return (
    <div className="test-case-grid">
      {scene.testCases.slice(0, 5).map((testCase, index) => (
        <article className="test-case-card" key={`${testCase.title}-${index}`}>
          <span>Test {index + 1}</span>
          <h3>{testCase.title}</h3>
          <p>{testCase.scenario}</p>
          <strong>{testCase.expected}</strong>
        </article>
      ))}
    </div>
  );
}
