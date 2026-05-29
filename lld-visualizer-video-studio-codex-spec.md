# LLD / Low-Level Design Video Studio — Codex Build Spec

## 1. Project Goal

Build a local web app that automatically creates animated **Low-Level Design (LLD) explanation videos** from structured JSON.

The app should generate videos for machine coding, object-oriented design, and LLD interview topics. The user should paste JSON describing an LLD problem, generate a timeline, preview the video, and export MP4.

The app should create videos with:

1. Problem statement
2. Functional requirements
3. Main entities/classes
4. Class diagram
5. Relationship explanation
6. Design patterns
7. Sequence diagram / object interaction flow
8. Code typing scene
9. Dry run / example scenario
10. Final design summary
11. End screen

---

## 2. Product Name

Use this name in the UI:

```txt
LLD Visualizer Video Studio
```

Subtitle:

```txt
Generate animated low-level design videos from JSON.
```

Tagline:

```txt
Paste an LLD config. Generate an animated OOP design explanation video.
```

---

## 3. Main Concept

Flow:

```txt
LLD JSON
   ↓
Validation
   ↓
Topic timeline generator
   ↓
Class diagram scenes
   ↓
Sequence / interaction scenes
   ↓
Code typing scenes
   ↓
Readable explanation panel
   ↓
MP4 export
```

The app should behave like a video studio where every scene explains one part of the design.

---

## 4. Important Visual Requirement

The video layout must include a readable explanation area.

For desktop videos:

```txt
┌──────────────────────────────────────────────┬──────────────────────┐
│                                              │                      │
│       Class Diagram / Sequence Diagram        │  Explanation Panel   │
│                                              │                      │
│  Vehicle ← Car                               │  Scene title         │
│  ParkingLot → ParkingSpot                    │  Key explanation     │
│  Ticket → Vehicle                            │  Bullet points       │
│                                              │  Interview note      │
│                                              │                      │
└──────────────────────────────────────────────┴──────────────────────┘
```

For vertical Shorts:

```txt
┌────────────────────────────┐
│ Scene Title                 │
├────────────────────────────┤
│ Diagram / Code Area         │
│                            │
│ Class diagram animation     │
│                            │
├────────────────────────────┤
│ Explanation Panel           │
│ Readable text               │
└────────────────────────────┘
```

Rules:

- If text is required, show it inside a dedicated explanation panel.
- Do not put long text inside the diagram itself.
- The diagram should stay clean.
- The panel should explain what the viewer is seeing.
- The right/bottom panel must be readable in the exported video.

---

## 5. MVP Scope

Build the first version for one topic:

```txt
Design a Parking Lot
```

The architecture must be extensible for future LLD topics:

```txt
snake-and-ladder
elevator-system
food-delivery-app
splitwise
bookmyshow
atm-machine
vending-machine
chess-game
tic-tac-toe
logging-framework
rate-limiter-lld
cache-lru
library-management-system
car-rental-system
hotel-management-system
```

---

## 6. Core Video Scenes for MVP

For Parking Lot, generate these scenes:

```txt
1. Title Scene
2. Problem Statement
3. Functional Requirements
4. Main Entities
5. Entity Responsibility Breakdown
6. Class Diagram
7. Relationships / Inheritance / Composition
8. Design Pattern Scene
9. Park Vehicle Sequence Flow
10. Exit Vehicle Sequence Flow
11. Code Structure
12. Code Typing: Core Classes
13. Example Dry Run
14. Final LLD Summary
15. End Screen
```

Each scene must include:

- Scene title
- Main visual area
- Highlighted classes / methods / relationships
- Explanation panel
- Optional narration text
- Fixed duration

---

## 7. Tech Stack

Use:

- React
- TypeScript
- Vite
- Node.js
- Express
- Playwright
- FFmpeg
- SVG for diagrams
- CSS modules or plain CSS

No external diagram library is required for MVP. Build custom SVG/HTML components for class diagrams and sequence diagrams.

Recommended package structure:

```txt
lld-visualizer-video-studio/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── pages/
│   │   ├── StudioPage.tsx
│   │   └── ExportPage.tsx
│   ├── components/
│   │   ├── JsonInputPanel.tsx
│   │   ├── VideoPreview.tsx
│   │   ├── SceneTimeline.tsx
│   │   ├── PlaybackControls.tsx
│   │   ├── ExplanationPanel.tsx
│   │   ├── RequirementCards.tsx
│   │   ├── EntityCards.tsx
│   │   ├── ClassDiagramCanvas.tsx
│   │   ├── ClassBox.tsx
│   │   ├── RelationshipArrow.tsx
│   │   ├── SequenceDiagramCanvas.tsx
│   │   ├── Lifeline.tsx
│   │   ├── MessageArrow.tsx
│   │   ├── PatternCard.tsx
│   │   ├── CodeTypingPanel.tsx
│   │   ├── DryRunPanel.tsx
│   │   └── EndScreen.tsx
│   ├── engine/
│   │   ├── sceneTypes.ts
│   │   ├── timelineEngine.ts
│   │   ├── playbackEngine.ts
│   │   ├── layoutEngine.ts
│   │   └── timing.ts
│   ├── topics/
│   │   ├── index.ts
│   │   ├── parkingLot.ts
│   │   ├── topicTypes.ts
│   │   └── demoConfigs.ts
│   ├── codegen/
│   │   ├── codeSnippets.ts
│   │   ├── javaParkingLot.ts
│   │   └── cppParkingLot.ts
│   ├── templates/
│   │   ├── matrixLld.ts
│   │   ├── minimalDark.ts
│   │   └── templateTypes.ts
│   ├── export/
│   │   ├── exportApi.ts
│   │   └── exportTypes.ts
│   └── styles/
│       ├── global.css
│       ├── studio.css
│       ├── preview.css
│       └── themes.css
│
├── server/
│   ├── index.ts
│   ├── exportRunner.ts
│   ├── ffmpeg.ts
│   └── projectStore.ts
│
├── projects/
│   └── .gitkeep
│
└── exports/
    └── .gitkeep
```

---

## 8. Studio UI Requirements

Create a full-screen dark UI.

Layout:

```txt
┌──────────────────────────────────────────────────────────────┐
│ LLD Visualizer Video Studio                                  │
├──────────────────────────┬───────────────────────────────────┤
│ Left Panel                │ Right Panel                       │
│                          │                                   │
│ JSON Input                │ Video Preview                     │
│ Template Selector         │ Scene Timeline                    │
│ Orientation Selector      │ Playback Controls                 │
│ Generate Timeline Button  │ Export Button                     │
│ Export Status             │                                   │
└──────────────────────────┴───────────────────────────────────┘
```

### Left Panel

Include:

- JSON editor textarea
- Load Parking Lot demo button
- Validate JSON button
- Generate timeline button
- Template selector
- Language selector
- Orientation selector
- Export MP4 button
- Export status area

### Right Panel

Include:

- Video preview frame
- Scene timeline list
- Current scene details
- Play / Pause / Restart buttons
- Jump to selected scene
- Export progress

---

## 9. Theme

Default theme:

```txt
Matrix LLD
```

CSS variables:

```css
:root {
  --bg-main: #050705;
  --bg-panel: #0a0f0a;
  --bg-card: #101810;
  --border: #1f3d2b;
  --text-main: #eafff1;
  --text-muted: #8fbf9f;
  --accent: #00ff66;
  --accent-soft: #9bffb8;
  --warning: #ffd166;
  --danger: #ff4d4d;
  --class-bg: #0f1a12;
  --class-border: #00ff66;
  --interface-border: #00ccff;
  --abstract-border: #ffd166;
  --relationship: #9bffb8;
}
```

Visual style:

- Dark cyberpunk background
- Neon class boxes
- Glowing arrows
- Animated highlight pulses
- Clear code editor panel
- Readable explanation panel
- Interview-focused annotations

---

## 10. Input Schema

Create:

```txt
src/topics/topicTypes.ts
```

Use:

```ts
export type LldVideoConfig = {
  template: "matrix-lld" | "minimal-dark";
  topic:
    | "parking-lot"
    | "snake-and-ladder"
    | "elevator-system"
    | "food-delivery-app"
    | "splitwise"
    | "bookmyshow"
    | "atm-machine"
    | "vending-machine"
    | "chess-game"
    | "tic-tac-toe"
    | "logging-framework"
    | "cache-lru";
  title: string;
  language: "java" | "cpp" | "typescript" | "python";
  settings: {
    orientation: "vertical" | "desktop";
    showRightTextPanel: boolean;
    showCode: boolean;
    showClassDiagram: boolean;
    showSequenceDiagram: boolean;
    speed?: "slow" | "normal" | "fast";
  };
  problem: {
    requirements: string[];
    entities: LldEntity[];
    relationships: LldRelationship[];
    flows: LldFlow[];
    patterns?: LldDesignPattern[];
    codeFiles?: LldCodeFile[];
    dryRuns?: LldDryRun[];
    tradeoffs?: string[];
    mistakesToAvoid?: string[];
  };
};

export type LldEntity = {
  id: string;
  name: string;
  type:
    | "class"
    | "abstract-class"
    | "interface"
    | "enum"
    | "singleton"
    | "service"
    | "repository"
    | "factory"
    | "strategy";
  responsibility: string;
  fields?: string[];
  methods?: string[];
  extends?: string;
  implements?: string[];
};

export type LldRelationship = {
  from: string;
  to: string;
  type:
    | "extends"
    | "implements"
    | "has-one"
    | "has-many"
    | "uses"
    | "creates"
    | "depends-on";
  label?: string;
};

export type LldFlow = {
  id: string;
  title: string;
  steps: LldFlowStep[];
};

export type LldFlowStep = {
  actor: string;
  target: string;
  method: string;
  explanation: string;
};

export type LldDesignPattern = {
  name: string;
  usedIn: string;
  reason: string;
};

export type LldCodeFile = {
  filename: string;
  language: "java" | "cpp" | "typescript" | "python";
  code: string;
};

export type LldDryRun = {
  title: string;
  steps: string[];
};
```

---

## 11. Scene Model

Create:

```txt
src/engine/sceneTypes.ts
```

Use:

```ts
export type LldScene =
  | LldTitleScene
  | LldTextScene
  | LldEntityScene
  | LldClassDiagramScene
  | LldRelationshipScene
  | LldPatternScene
  | LldSequenceScene
  | LldCodeScene
  | LldDryRunScene
  | LldSummaryScene
  | LldEndScene;

export type BaseLldScene = {
  id: string;
  type: string;
  title: string;
  durationMs: number;
  rightPanel: {
    heading: string;
    body?: string;
    bullets?: string[];
    interviewNote?: string;
  };
  narration?: string;
};

export type LldTitleScene = BaseLldScene & {
  type: "title";
  titleText: string;
  subtitle?: string;
};

export type LldTextScene = BaseLldScene & {
  type: "text";
  cards: string[];
};

export type LldEntityScene = BaseLldScene & {
  type: "entities";
  entities: LldEntity[];
  highlightedEntityIds?: string[];
};

export type LldClassDiagramScene = BaseLldScene & {
  type: "classDiagram";
  entities: LldEntity[];
  relationships: LldRelationship[];
  highlightedEntityIds?: string[];
  highlightedRelationshipIndexes?: number[];
};

export type LldRelationshipScene = BaseLldScene & {
  type: "relationship";
  entities: LldEntity[];
  relationships: LldRelationship[];
  activeRelationshipIndex: number;
};

export type LldPatternScene = BaseLldScene & {
  type: "pattern";
  pattern: LldDesignPattern;
  entities: LldEntity[];
  highlightedEntityIds?: string[];
};

export type LldSequenceScene = BaseLldScene & {
  type: "sequence";
  flow: LldFlow;
  activeStepIndex: number;
};

export type LldCodeScene = BaseLldScene & {
  type: "code";
  filename: string;
  language: string;
  code: string;
  charsPerSecond: number;
};

export type LldDryRunScene = BaseLldScene & {
  type: "dryRun";
  dryRun: LldDryRun;
  activeStepIndex?: number;
};

export type LldSummaryScene = BaseLldScene & {
  type: "summary";
  entities: LldEntity[];
  summaryBullets: string[];
};

export type LldEndScene = BaseLldScene & {
  type: "end";
  text: string;
};
```

Important:

- Every scene must include `rightPanel`.
- `rightPanel` is the readable explanation area.
- Long text belongs in `rightPanel`, not inside the diagram.

---

## 12. Timeline Generator

Create:

```txt
src/engine/timelineEngine.ts
```

Main function:

```ts
export function generateLldTimeline(config: LldVideoConfig): LldScene[] {
  if (config.topic === "parking-lot") {
    return generateParkingLotTimeline(config);
  }

  throw new Error(`Unsupported LLD topic: ${config.topic}`);
}
```

For Parking Lot, generate:

```ts
export function generateParkingLotTimeline(config: LldVideoConfig): LldScene[] {
  const entities = config.problem.entities;
  const relationships = config.problem.relationships;
  const parkFlow = config.problem.flows.find(flow => flow.id === "park-vehicle");
  const exitFlow = config.problem.flows.find(flow => flow.id === "exit-vehicle");
  const patterns = config.problem.patterns || [];

  const scenes: LldScene[] = [
    {
      id: "title",
      type: "title",
      title: "Title",
      durationMs: 2500,
      titleText: config.title,
      subtitle: "Low Level Design Explained Visually",
      rightPanel: {
        heading: "Goal",
        body: "Design clean classes, responsibilities, relationships, and object interactions for a Parking Lot system."
      },
      narration: "Let us design a parking lot using low-level design principles."
    },
    {
      id: "requirements",
      type: "text",
      title: "Functional Requirements",
      durationMs: 5000,
      cards: config.problem.requirements,
      rightPanel: {
        heading: "Functional Requirements",
        bullets: config.problem.requirements,
        interviewNote: "Always clarify requirements before jumping into classes."
      },
      narration: "Start by listing the behavior the system must support."
    },
    {
      id: "main-entities",
      type: "entities",
      title: "Main Entities",
      durationMs: 5500,
      entities,
      highlightedEntityIds: entities.slice(0, 5).map(entity => entity.id),
      rightPanel: {
        heading: "Identify Core Entities",
        bullets: entities.slice(0, 6).map(entity => `${entity.name}: ${entity.responsibility}`),
        interviewNote: "Good LLD starts by separating responsibilities across entities."
      },
      narration: "Now identify the main classes in the system."
    },
    {
      id: "class-diagram",
      type: "classDiagram",
      title: "Class Diagram",
      durationMs: 6500,
      entities,
      relationships,
      highlightedEntityIds: [],
      highlightedRelationshipIndexes: [],
      rightPanel: {
        heading: "Class Diagram",
        bullets: [
          "Vehicle is the base abstraction.",
          "ParkingSpot owns vehicle parking behavior.",
          "ParkingTicket stores entry details.",
          "ParkingLot coordinates parking and exit.",
          "Strategies can handle fee calculation."
        ],
        interviewNote: "Each class should have one clear responsibility."
      },
      narration: "This is the first version of the class diagram."
    }
  ];

  relationships.forEach((relationship, index) => {
    scenes.push({
      id: `relationship-${index + 1}`,
      type: "relationship",
      title: "Relationship Breakdown",
      durationMs: 3500,
      entities,
      relationships,
      activeRelationshipIndex: index,
      rightPanel: {
        heading: `${relationship.from} ${relationship.type} ${relationship.to}`,
        body: explainRelationship(relationship),
        bullets: [
          `From: ${relationship.from}`,
          `To: ${relationship.to}`,
          `Type: ${relationship.type}`
        ],
        interviewNote: "Explain why the relationship exists, not just what arrow is drawn."
      },
      narration: explainRelationship(relationship)
    });
  });

  patterns.forEach((pattern, index) => {
    scenes.push({
      id: `pattern-${index + 1}`,
      type: "pattern",
      title: "Design Pattern",
      durationMs: 4500,
      pattern,
      entities,
      highlightedEntityIds: [pattern.usedIn],
      rightPanel: {
        heading: `${pattern.name} Pattern`,
        body: pattern.reason,
        bullets: [
          `Pattern: ${pattern.name}`,
          `Used in: ${pattern.usedIn}`,
          `Reason: ${pattern.reason}`
        ],
        interviewNote: "Only use design patterns when they simplify the design."
      },
      narration: `${pattern.name} is used in ${pattern.usedIn}. ${pattern.reason}`
    });
  });

  if (parkFlow) {
    parkFlow.steps.forEach((step, index) => {
      scenes.push({
        id: `park-flow-${index + 1}`,
        type: "sequence",
        title: "Park Vehicle Flow",
        durationMs: 4000,
        flow: parkFlow,
        activeStepIndex: index,
        rightPanel: {
          heading: `Step ${index + 1}: ${step.method}`,
          body: step.explanation,
          bullets: [
            `Actor: ${step.actor}`,
            `Target: ${step.target}`,
            `Method: ${step.method}`
          ],
          interviewNote: "Sequence flow proves that your classes can actually work together."
        },
        narration: step.explanation
      });
    });
  }

  if (exitFlow) {
    exitFlow.steps.forEach((step, index) => {
      scenes.push({
        id: `exit-flow-${index + 1}`,
        type: "sequence",
        title: "Exit Vehicle Flow",
        durationMs: 4000,
        flow: exitFlow,
        activeStepIndex: index,
        rightPanel: {
          heading: `Step ${index + 1}: ${step.method}`,
          body: step.explanation,
          bullets: [
            `Actor: ${step.actor}`,
            `Target: ${step.target}`,
            `Method: ${step.method}`
          ],
          interviewNote: "Exit flow should cover fee calculation and freeing the parking spot."
        },
        narration: step.explanation
      });
    });
  }

  if (config.settings.showCode) {
    const codeFiles = config.problem.codeFiles || getDefaultParkingLotCodeFiles(config.language);

    codeFiles.slice(0, 3).forEach((file, index) => {
      scenes.push({
        id: `code-${index + 1}`,
        type: "code",
        title: `Code: ${file.filename}`,
        durationMs: 8500,
        filename: file.filename,
        language: file.language,
        code: file.code,
        charsPerSecond: 45,
        rightPanel: {
          heading: `Code Structure: ${file.filename}`,
          bullets: [
            "Focus on clean responsibilities.",
            "Keep classes small.",
            "Use interfaces or strategies where behavior may change.",
            "Avoid putting all logic in one manager class."
          ],
          interviewNote: "In machine coding, readable code is more important than over-engineering."
        },
        narration: `Now let us look at ${file.filename}.`
      });
    });
  }

  const dryRuns = config.problem.dryRuns || getDefaultParkingLotDryRuns();

  dryRuns.forEach((dryRun, index) => {
    scenes.push({
      id: `dry-run-${index + 1}`,
      type: "dryRun",
      title: dryRun.title,
      durationMs: 5000,
      dryRun,
      activeStepIndex: 0,
      rightPanel: {
        heading: dryRun.title,
        bullets: dryRun.steps,
        interviewNote: "A dry run shows that your design handles real use cases."
      },
      narration: dryRun.title
    });
  });

  scenes.push({
    id: "summary",
    type: "summary",
    title: "Final LLD Summary",
    durationMs: 5000,
    entities,
    summaryBullets: [
      "Separate entities by responsibility.",
      "Use inheritance for vehicle types.",
      "Use composition for parking lot, floors and spots.",
      "Use ticket object to track parking session.",
      "Use strategy pattern for fee calculation."
    ],
    rightPanel: {
      heading: "Final Design Summary",
      bullets: [
        "Vehicle hierarchy handles different vehicle types.",
        "ParkingSpot manages occupancy.",
        "ParkingTicket stores parking session details.",
        "ParkingLot coordinates the main flow.",
        "Fee strategy makes pricing extensible."
      ],
      interviewNote: "End with trade-offs, extensibility, and edge cases."
    },
    narration: "This is the final low-level design summary."
  });

  scenes.push({
    id: "end",
    type: "end",
    title: "End",
    durationMs: 2500,
    text: "Follow for more LLD animations",
    rightPanel: {
      heading: "Next Topics",
      body: "Elevator System, Snake and Ladder, Splitwise, BookMyShow, and more."
    },
    narration: "Follow for more low-level design animations."
  });

  return scenes;
}
```

---

## 13. Class Diagram Canvas

Create:

```txt
src/components/ClassDiagramCanvas.tsx
```

Responsibilities:

- Render class boxes.
- Render inheritance / implementation / composition arrows.
- Highlight active classes.
- Highlight active relationships.
- Avoid clutter.
- Keep class text readable.

Class box format:

```txt
┌─────────────────────┐
│ ParkingSpot         │
├─────────────────────┤
│ - spotId            │
│ - spotType          │
│ - isAvailable       │
├─────────────────────┤
│ + parkVehicle()     │
│ + removeVehicle()   │
└─────────────────────┘
```

Entity type styles:

```txt
class           green border
abstract-class  yellow border
interface       blue border
enum            purple border
singleton       glowing green border
strategy        pink border
repository      cyan border
```

Relationship styles:

```txt
extends       solid arrow
implements    dashed arrow
has-one       diamond connector
has-many      diamond connector with label
uses          dotted arrow
creates       animated arrow
depends-on    thin arrow
```

---

## 14. Sequence Diagram Canvas

Create:

```txt
src/components/SequenceDiagramCanvas.tsx
```

Show object interaction flow.

Example:

```txt
Driver        ParkingLot       ParkingFloor       ParkingSpot       Ticket
  |               |                 |                  |              |
  | parkVehicle() |                 |                  |              |
  |-------------->|                 |                  |              |
  |               | findSpot()      |                  |              |
  |               |---------------->|                  |              |
  |               |                 | parkVehicle()    |              |
  |               |                 |----------------->|              |
  |               | createTicket()  |                  |              |
  |               |------------------------------------------------->|
```

Requirements:

- Show lifelines.
- Highlight current step.
- Show active method call arrow.
- Right panel explains the current method call.
- For vertical layout, simplify and show fewer lifelines at once if needed.

---

## 15. Explanation Panel

Create:

```txt
src/components/ExplanationPanel.tsx
```

The panel must show:

- Scene title
- Heading
- Body
- Bullet points
- Interview note

Example:

```txt
Park Vehicle Flow

Step 2: findAvailableSpot(vehicleType)

ParkingLot asks ParkingFloor to find a compatible spot for the given vehicle type.

Key Points:
- Do not put spot-search logic inside Vehicle.
- ParkingFloor owns spot availability.
- ParkingLot coordinates the flow.

Interview Note:
Sequence flow proves that your classes are usable, not just drawn.
```

Rules:

- Large readable font.
- Avoid long paragraphs.
- Use max 3–5 bullets.
- Show important interview note separately.
- Must be visible in exported video.

---

## 16. Code Typing Panel

Create:

```txt
src/components/CodeTypingPanel.tsx
```

It should show code being typed progressively.

Inputs:

```ts
{
  filename: string;
  language: string;
  code: string;
  charsPerSecond: number;
  progress: number;
}
```

Requirements:

- Show filename tab.
- Type code progressively.
- Use syntax-like colors with CSS.
- Keep code readable.
- Do not show too many lines at once.
- Auto-scroll as code types.
- Support Java first.

MVP can use plain text with simple coloring; full syntax highlighting can be added later.

---

## 17. Parking Lot Default Code Snippets

Create:

```txt
src/codegen/javaParkingLot.ts
```

Include concise Java code snippets.

### Vehicle.java

```java
enum VehicleType {
    BIKE, CAR, TRUCK
}

abstract class Vehicle {
    private final String vehicleNumber;
    private final VehicleType vehicleType;

    protected Vehicle(String vehicleNumber, VehicleType vehicleType) {
        this.vehicleNumber = vehicleNumber;
        this.vehicleType = vehicleType;
    }

    public VehicleType getVehicleType() {
        return vehicleType;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }
}

class Car extends Vehicle {
    public Car(String vehicleNumber) {
        super(vehicleNumber, VehicleType.CAR);
    }
}
```

### ParkingSpot.java

```java
class ParkingSpot {
    private final String spotId;
    private final VehicleType supportedType;
    private Vehicle parkedVehicle;

    public ParkingSpot(String spotId, VehicleType supportedType) {
        this.spotId = spotId;
        this.supportedType = supportedType;
    }

    public boolean canFit(Vehicle vehicle) {
        return parkedVehicle == null &&
               supportedType == vehicle.getVehicleType();
    }

    public void parkVehicle(Vehicle vehicle) {
        if (!canFit(vehicle)) {
            throw new IllegalStateException("Spot not available");
        }
        this.parkedVehicle = vehicle;
    }

    public void removeVehicle() {
        this.parkedVehicle = null;
    }
}
```

### ParkingTicket.java

```java
class ParkingTicket {
    private final String ticketId;
    private final Vehicle vehicle;
    private final ParkingSpot spot;
    private final long entryTime;

    public ParkingTicket(String ticketId, Vehicle vehicle, ParkingSpot spot) {
        this.ticketId = ticketId;
        this.vehicle = vehicle;
        this.spot = spot;
        this.entryTime = System.currentTimeMillis();
    }

    public ParkingSpot getSpot() {
        return spot;
    }

    public long getEntryTime() {
        return entryTime;
    }
}
```

### ParkingLot.java

```java
class ParkingLot {
    private static ParkingLot instance;
    private final List<ParkingFloor> floors = new ArrayList<>();

    private ParkingLot() {}

    public static synchronized ParkingLot getInstance() {
        if (instance == null) {
            instance = new ParkingLot();
        }
        return instance;
    }

    public ParkingTicket parkVehicle(Vehicle vehicle) {
        for (ParkingFloor floor : floors) {
            ParkingSpot spot = floor.findAvailableSpot(vehicle);
            if (spot != null) {
                spot.parkVehicle(vehicle);
                return new ParkingTicket(UUID.randomUUID().toString(), vehicle, spot);
            }
        }

        throw new IllegalStateException("No spot available");
    }

    public void unparkVehicle(ParkingTicket ticket) {
        ticket.getSpot().removeVehicle();
    }
}
```

---

## 18. Video Preview Layout

Create:

```txt
src/components/VideoPreview.tsx
```

For desktop:

```txt
┌──────────────────────────────────────┬──────────────────────┐
│ Diagram / Code Area                   │ Explanation Panel    │
│                                      │                      │
└──────────────────────────────────────┴──────────────────────┘
```

For vertical:

```txt
┌──────────────────────────────┐
│ Scene Title                   │
├──────────────────────────────┤
│ Diagram / Code Area           │
├──────────────────────────────┤
│ Explanation Panel             │
└──────────────────────────────┘
```

Pseudo:

```tsx
export function VideoPreview({ scene, orientation, progress }) {
  return (
    <div className={`lld-preview ${orientation}`}>
      <div className="scene-header">
        <span>{scene.title}</span>
      </div>

      <div className="preview-content">
        <div className="visual-zone">
          <SceneRenderer scene={scene} progress={progress} />
        </div>

        {scene.rightPanel && (
          <ExplanationPanel panel={scene.rightPanel} />
        )}
      </div>
    </div>
  );
}
```

---

## 19. Scene Renderer

Create:

```txt
src/components/SceneRenderer.tsx
```

Render by scene type:

```tsx
export function SceneRenderer({ scene, progress }) {
  switch (scene.type) {
    case "title":
      return <TitleScene scene={scene} />;
    case "text":
      return <RequirementCards scene={scene} />;
    case "entities":
      return <EntityCards scene={scene} />;
    case "classDiagram":
      return <ClassDiagramCanvas scene={scene} progress={progress} />;
    case "relationship":
      return <ClassDiagramCanvas scene={scene} progress={progress} />;
    case "pattern":
      return <PatternCard scene={scene} />;
    case "sequence":
      return <SequenceDiagramCanvas scene={scene} progress={progress} />;
    case "code":
      return <CodeTypingPanel scene={scene} progress={progress} />;
    case "dryRun":
      return <DryRunPanel scene={scene} progress={progress} />;
    case "summary":
      return <EntityCards scene={scene} />;
    case "end":
      return <EndScreen scene={scene} />;
    default:
      return null;
  }
}
```

---

## 20. Playback Engine

Create deterministic playback.

State:

```ts
export type PlaybackState = {
  isPlaying: boolean;
  currentSceneIndex: number;
  sceneElapsedMs: number;
  totalElapsedMs: number;
  progress: number;
  isFinished: boolean;
};
```

Requirements:

- Play
- Pause
- Restart
- Jump to scene
- Auto-play in export mode
- Fixed scene durations
- No randomness during export

At the end of export route playback, set:

```ts
(window as any).__LLD_EXPORT_DONE__ = true;
```

---

## 21. Export Flow

Use Express + Playwright + FFmpeg.

### Server endpoints

```txt
POST /api/export
GET /api/export/:exportId/status
GET /api/export/:exportId/download
GET /api/projects/:exportId
```

### POST /api/export

Input:

```ts
{
  config: LldVideoConfig;
  scenes: LldScene[];
}
```

Server should:

1. Generate exportId.
2. Save JSON to `projects/<exportId>.json`.
3. Start export process.
4. Return exportId.

### Export runner

Create:

```txt
server/exportRunner.ts
```

Flow:

```txt
Launch Playwright Chromium
Open http://localhost:5173/export/<exportId>
Set viewport based on orientation
Capture screenshots at 30 FPS
Wait until window.__LLD_EXPORT_DONE__ === true
Run FFmpeg
Create output.mp4
Generate metadata files
```

### Viewport

Vertical:

```txt
1080 x 1920
```

Desktop:

```txt
1920 x 1080
```

### FFmpeg

```bash
ffmpeg -y -framerate 30 -i frame-%06d.png -c:v libx264 -pix_fmt yuv420p output.mp4
```

---

## 22. Export Page

Create:

```txt
src/pages/ExportPage.tsx
```

Route:

```txt
/export/:exportId
```

Behavior:

- Load project JSON from server.
- Render only the video frame.
- Start playback automatically.
- Hide Studio controls.
- Set `window.__LLD_EXPORT_DONE__ = true` when finished.

---

## 23. Metadata Generation

After export, create:

```txt
exports/<exportId>/
├── output.mp4
├── title.txt
├── description.txt
├── tags.txt
└── metadata.json
```

For Parking Lot:

### title.txt

```txt
Design a Parking Lot | LLD Explained Visually
```

### description.txt

```txt
Learn how to design a Parking Lot system using low-level design and object-oriented principles.

Covered:
- Functional requirements
- Core entities
- Class diagram
- Relationships
- Design patterns
- Park vehicle flow
- Exit vehicle flow
- Java code structure
- Dry run example
- Interview notes

#LLD #LowLevelDesign #ParkingLot #Java #OOP #CodingInterview #SystemDesign
```

### tags.txt

```txt
LLD, Low Level Design, Parking Lot Design, Java, OOP, Object Oriented Design, Coding Interview, Machine Coding, System Design
```

---

## 24. Demo Config

Create:

```txt
src/topics/demoConfigs.ts
```

Add:

```ts
export const parkingLotDemoConfig: LldVideoConfig = {
  template: "matrix-lld",
  topic: "parking-lot",
  title: "Design a Parking Lot",
  language: "java",
  settings: {
    orientation: "vertical",
    showRightTextPanel: true,
    showCode: true,
    showClassDiagram: true,
    showSequenceDiagram: true,
    speed: "normal"
  },
  problem: {
    requirements: [
      "Support multiple parking floors",
      "Support different vehicle types",
      "Assign nearest available parking spot",
      "Generate parking ticket",
      "Calculate parking fee on exit"
    ],
    entities: [
      {
        id: "vehicle",
        name: "Vehicle",
        type: "abstract-class",
        responsibility: "Base class for all vehicles",
        fields: ["vehicleNumber", "vehicleType"],
        methods: ["getVehicleType()", "getVehicleNumber()"]
      },
      {
        id: "car",
        name: "Car",
        type: "class",
        extends: "Vehicle",
        responsibility: "Represents a car vehicle"
      },
      {
        id: "parkingFloor",
        name: "ParkingFloor",
        type: "class",
        responsibility: "Manages parking spots on one floor",
        fields: ["floorId", "spots"],
        methods: ["findAvailableSpot(vehicle)"]
      },
      {
        id: "parkingSpot",
        name: "ParkingSpot",
        type: "class",
        responsibility: "Represents one parking slot",
        fields: ["spotId", "supportedType", "parkedVehicle"],
        methods: ["canFit(vehicle)", "parkVehicle(vehicle)", "removeVehicle()"]
      },
      {
        id: "parkingTicket",
        name: "ParkingTicket",
        type: "class",
        responsibility: "Stores parking session details",
        fields: ["ticketId", "vehicle", "spot", "entryTime"],
        methods: ["getSpot()", "getEntryTime()"]
      },
      {
        id: "parkingLot",
        name: "ParkingLot",
        type: "singleton",
        responsibility: "Main coordinator for parking and exit operations",
        fields: ["floors"],
        methods: ["getInstance()", "parkVehicle(vehicle)", "unparkVehicle(ticket)"]
      },
      {
        id: "feeStrategy",
        name: "FeeCalculationStrategy",
        type: "strategy",
        responsibility: "Calculates parking fee using pluggable pricing rules",
        methods: ["calculateFee(ticket)"]
      }
    ],
    relationships: [
      { from: "Car", to: "Vehicle", type: "extends" },
      { from: "ParkingLot", to: "ParkingFloor", type: "has-many" },
      { from: "ParkingFloor", to: "ParkingSpot", type: "has-many" },
      { from: "ParkingTicket", to: "Vehicle", type: "has-one" },
      { from: "ParkingTicket", to: "ParkingSpot", type: "has-one" },
      { from: "ParkingLot", to: "FeeCalculationStrategy", type: "uses" }
    ],
    flows: [
      {
        id: "park-vehicle",
        title: "Park Vehicle Flow",
        steps: [
          {
            actor: "Driver",
            target: "ParkingLot",
            method: "parkVehicle(car)",
            explanation: "Driver requests parking for a car."
          },
          {
            actor: "ParkingLot",
            target: "ParkingFloor",
            method: "findAvailableSpot(vehicle)",
            explanation: "Parking lot asks floors to find a compatible available spot."
          },
          {
            actor: "ParkingFloor",
            target: "ParkingSpot",
            method: "canFit(vehicle)",
            explanation: "Parking floor checks whether the spot supports this vehicle type and is free."
          },
          {
            actor: "ParkingSpot",
            target: "ParkingSpot",
            method: "parkVehicle(vehicle)",
            explanation: "The selected spot stores the vehicle and becomes occupied."
          },
          {
            actor: "ParkingLot",
            target: "ParkingTicket",
            method: "createTicket(vehicle, spot)",
            explanation: "Parking lot generates a ticket with vehicle, spot and entry time."
          }
        ]
      },
      {
        id: "exit-vehicle",
        title: "Exit Vehicle Flow",
        steps: [
          {
            actor: "Driver",
            target: "ParkingLot",
            method: "unparkVehicle(ticket)",
            explanation: "Driver exits using the parking ticket."
          },
          {
            actor: "ParkingLot",
            target: "FeeCalculationStrategy",
            method: "calculateFee(ticket)",
            explanation: "Parking lot calculates the fee using the selected fee strategy."
          },
          {
            actor: "ParkingLot",
            target: "ParkingSpot",
            method: "removeVehicle()",
            explanation: "The occupied spot is freed after payment."
          }
        ]
      }
    ],
    patterns: [
      {
        name: "Singleton",
        usedIn: "ParkingLot",
        reason: "Only one central parking lot manager should coordinate all parking operations."
      },
      {
        name: "Strategy",
        usedIn: "FeeCalculationStrategy",
        reason: "Pricing rules can change without modifying ParkingLot."
      }
    ],
    dryRuns: [
      {
        title: "Example Dry Run",
        steps: [
          "Car KA-01 enters the parking lot.",
          "ParkingLot searches floors for an available CAR spot.",
          "ParkingSpot C1 is available.",
          "Car is parked at C1.",
          "ParkingTicket T1 is generated.",
          "On exit, fee is calculated and C1 becomes free."
        ]
      }
    ],
    tradeoffs: [
      "Simple manager class vs multiple services",
      "Nearest spot allocation vs first available spot",
      "Fixed fee calculation vs strategy-based fee calculation",
      "In-memory design vs persistent storage"
    ],
    mistakesToAvoid: [
      "Putting all logic inside one ParkingLot class",
      "Ignoring vehicle type compatibility",
      "Not freeing the spot on exit",
      "Skipping sequence flow explanation"
    ]
  }
};
```

---

## 25. Validation Rules

Validate:

- `title` is required.
- `topic` is supported.
- `language` is supported.
- `entities` cannot be empty.
- Each entity must have unique `id`.
- Each relationship must reference existing entity names or IDs.
- Each flow step must have actor, target, method and explanation.
- If `showRightTextPanel` is true, every scene must have `rightPanel`.
- If `showCode` is true, code snippets must exist or be generated from defaults.
- `settings.orientation` must be `vertical` or `desktop`.

Show validation errors in the Studio UI.

---

## 26. MVP Acceptance Criteria

The project is complete when:

1. User can run the app locally.
2. User can load Parking Lot demo config.
3. User can paste/edit JSON.
4. JSON validation works.
5. Timeline generation works.
6. Video preview works.
7. Requirements scene renders.
8. Entity scene renders.
9. Class diagram renders.
10. Relationships animate/highlight.
11. Design pattern scenes render.
12. Sequence diagram renders.
13. Code typing panel renders Java snippets.
14. Dry run scene renders.
15. Final summary renders.
16. Explanation text appears on the right side for desktop.
17. Explanation text appears as a bottom panel for vertical.
18. Export page auto-plays.
19. Playwright captures frames.
20. FFmpeg creates MP4.
21. Exported video matches preview.
22. Metadata files are generated.

---

## 27. Future Topics

After Parking Lot, add:

```txt
snake-and-ladder
elevator-system
splitwise
bookmyshow
atm-machine
vending-machine
chess-game
tic-tac-toe
logging-framework
cache-lru
food-delivery-app
hotel-management-system
library-management-system
```

Each topic should provide:

```txt
demo config
entities
relationships
flows
patterns
dry runs
code snippets
timeline generator
```

---

## 28. Build Priority

Build in this exact order:

1. Project setup
2. Studio UI shell
3. JSON editor
4. Demo config loader
5. Config validation
6. Scene type definitions
7. Parking Lot timeline generator
8. Playback engine
9. Video preview layout
10. Explanation panel
11. Requirement cards
12. Entity cards
13. Class diagram canvas
14. Class box component
15. Relationship arrows
16. Sequence diagram canvas
17. Pattern card
18. Code typing panel
19. Dry run panel
20. Summary scene
21. Export page
22. Express server
23. Playwright frame capture
24. FFmpeg render
25. Metadata generation
26. UI polish
27. README

---

## 29. Commands

Recommended scripts:

```json
{
  "scripts": {
    "dev": "concurrently \"vite\" \"tsx server/index.ts\"",
    "build": "vite build",
    "preview": "vite preview",
    "server": "tsx server/index.ts"
  }
}
```

Setup:

```bash
npm install
npx playwright install chromium
```

Run:

```bash
npm run dev
```

Studio:

```txt
http://localhost:5173
```

Server:

```txt
http://localhost:3001
```

---

## 30. Final Expected Result

The user should be able to paste an LLD JSON, click:

```txt
Generate Timeline
Play Preview
Export MP4
```

And get a complete animated LLD video with:

- Problem statement
- Requirements
- Entity breakdown
- Class diagram
- Relationship animation
- Design pattern explanation
- Sequence diagram
- Code typing
- Dry run
- Interview notes
- Final MP4 export
- YouTube-ready metadata

This tool should make it easy to generate LLD interview videos for YouTube Shorts, long-form tutorials, and machine coding preparation.
