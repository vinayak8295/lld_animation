# LLD Visualizer Implementation Guide

This document explains how the current HLD Visualizer Video Studio was built and how to reuse the same approach for an LLD-focused version.

## Goal

The HLD app takes a structured topic config, generates a slide timeline, lets the user edit voiceover text, previews the lesson in the browser, and exports:

- MP4 video with generated audio
- voiceover script
- ElevenLabs-clean script
- PPT-only deck

For LLD, use the same pipeline, but replace HLD concepts like architecture, cache, queue, and scaling with LLD concepts like classes, interfaces, objects, design patterns, APIs, state transitions, edge cases, and code-level reasoning.

## Current HLD Architecture

### Main Frontend Flow

The main UI is centered around `StudioPage`.

Important responsibilities:

- Loads the selected HLD question JSON.
- Generates scenes from the JSON.
- Lets the user edit the voiceover script.
- Applies edited voiceover back onto scenes.
- Starts MP4 export.
- Downloads PPT and scripts.

Key files:

- `src/pages/StudioPage.tsx`
- `src/components/JsonInputPanel.tsx`
- `src/components/VideoPreview.tsx`
- `src/components/SceneTimeline.tsx`
- `src/components/ArchitectureCanvas.tsx`

### Config Model

Each HLD question is represented as a structured config.

Key file:

- `src/topics/topicTypes.ts`

The HLD config contains:

- topic id
- title
- settings
- requirements
- non-functional requirements
- components
- flows
- database schema
- bottlenecks
- trade-offs

For LLD, create an equivalent model such as `LldProblemConfig`.

Suggested LLD fields:

- problem id
- title
- difficulty
- requirements
- constraints
- core entities
- classes
- interfaces
- relationships
- design patterns
- APIs or public methods
- state transitions
- edge cases
- concurrency concerns
- test cases
- trade-offs

## Scene Generation

### HLD Scene Types

The HLD app uses a scene union in:

- `src/engine/sceneTypes.ts`

Current scene types:

- `title`
- `text`
- `deep-dive`
- `architecture`
- `flow`
- `database`
- `bottleneck`
- `summary`
- `end`

For LLD, define scene types around code-level design.

Suggested LLD scene types:

- `title`
- `problem`
- `requirements`
- `class-diagram`
- `interface-design`
- `object-flow`
- `sequence-flow`
- `state-machine`
- `pattern-deep-dive`
- `edge-cases`
- `code-skeleton`
- `test-cases`
- `trade-offs`
- `summary`

### Timeline Engine

The HLD slide timeline is generated in:

- `src/engine/timelineEngine.ts`

The generator does this:

1. Reads the selected topic config.
2. Builds base slides: title, problem, requirements, architecture.
3. Adds deep-dive slides.
4. Converts flows into step-by-step scenes.
5. Adds database, bottleneck, trade-off, summary, and end scenes.
6. Applies timing rules.

For LLD, create an equivalent `lldTimelineEngine.ts`.

Recommended generated LLD slide order:

1. Title
2. Problem statement
3. Functional requirements
4. Constraints and assumptions
5. Core objects/entities
6. Class diagram
7. Interface design
8. Public method contracts
9. Object collaboration flow
10. Sequence diagram
11. State transitions
12. Design pattern choice
13. Data structures used
14. Edge cases
15. Error handling
16. Concurrency/thread-safety
17. Code skeleton
18. Unit test cases
19. Trade-offs
20. Final summary

## Deep-Dive Profiles

The HLD app uses a `DepthProfile` inside `timelineEngine.ts`.

This lets one generic generator produce detailed slides for many different questions.

Current HLD profile includes:

- APIs
- request lifecycle
- data model
- indexing
- partitioning
- cache policy
- queue strategy
- capacity estimates
- failure modes
- security controls
- observability
- interview trade-offs

For LLD, create an `LldDepthProfile`.

Suggested fields:

- public APIs/methods
- class responsibilities
- interface contracts
- inheritance/composition choices
- design patterns
- data structures
- object lifecycle
- state transitions
- validation rules
- error handling
- concurrency controls
- extensibility points
- test cases
- interview pitfalls
- trade-off explanation

Example:

```ts
type LldDepthProfile = {
  publicMethods: string[];
  classResponsibilities: string[];
  interfaces: string[];
  relationships: string[];
  designPatterns: string[];
  dataStructures: string[];
  stateTransitions: string[];
  edgeCases: string[];
  concurrencyConcerns: string[];
  testCases: string[];
  tradeoffs: string[];
  interviewPitfalls: string[];
};
```

Use topic-specific overrides for common LLD interview questions:

- Design Parking Lot
- Design Elevator
- Design Vending Machine
- Design Chess
- Design Snake and Ladder
- Design Library Management System
- Design Movie Ticket Booking
- Design Splitwise
- Design Logger
- Design Rate Limiter
- Design LRU Cache
- Design LFU Cache
- Design File System
- Design ATM
- Design Pub/Sub

Use a generic fallback profile so every new LLD problem still generates useful slides.

## Voiceover Script Generation

The HLD script generator is in:

- `src/export/voiceoverScript.ts`

It generates two script formats:

1. Full script with slide names and durations.
2. ElevenLabs-clean script without slide labels or duration lines.

Important behavior:

- User-edited voiceover text overrides generated narration.
- Slide markers are parsed back into per-slide narration.
- The export pipeline uses narration per slide.

For LLD, keep the same pattern.

Suggested LLD narration style:

- Start with the real interview framing.
- Explain why each class exists.
- Explain why each interface exists.
- Explain object collaboration step by step.
- Call out where design patterns help.
- Explain edge cases before code.
- Explain test cases as proof of design correctness.

Example narration direction:

```text
Use a calm interview-teaching voice. Explain class responsibilities, object collaboration, edge cases, and trade-offs. Avoid reading code mechanically. Focus on why the design is extensible and testable.
```

## Visual Rendering

### HLD Visuals

The HLD app renders:

- architecture diagrams
- component boxes
- arrows
- active flow highlights
- right-side explanation panels

For LLD, replace architecture visuals with:

- class boxes
- interface boxes
- inheritance arrows
- composition/aggregation links
- sequence messages
- state machine transitions
- code skeleton panels
- test case panels

Suggested components:

- `ClassDiagramCanvas`
- `SequenceDiagramCanvas`
- `StateMachineCanvas`
- `CodeSkeletonView`
- `LldVideoPreview`

### Highlighting

The HLD app automatically highlights architecture arrows based on narration.

For LLD, use the same concept:

- Highlight class relationships when narration mentions a class.
- Highlight sequence arrows when narration describes object calls.
- Highlight state transitions when narration mentions events.
- Highlight code blocks when narration discusses a method.

Example:

If narration says:

```text
The ParkingLot delegates spot selection to the ParkingFloor, and the TicketService creates the parking ticket.
```

Then highlight:

- `ParkingLot -> ParkingFloor`
- `ParkingFloor -> ParkingSpot`
- `TicketService -> ParkingTicket`

## Export Pipeline

### MP4 Export

The HLD backend export flow is:

1. Save project JSON.
2. Generate per-slide voiceover audio.
3. Adjust slide duration based on audio length.
4. Capture browser frames using Playwright.
5. Encode video using FFmpeg.
6. Mux narration audio.
7. Add intro and outro videos.
8. Save metadata and download MP4.

Key files:

- `server/index.ts`
- `server/exportRunner.ts`
- `server/slideVoiceover.ts`
- `server/videoEncoder.ts`
- `server/videoComposer.ts`

For LLD, reuse this export pipeline directly.

Only the scene generation and visual renderer need to change.

### PPT Export

The PPT exporter is in:

- `server/pptRunner.ts`

It creates one PPT slide per generated scene and adds speaker notes.

For LLD, create an LLD-aware PPT renderer that supports:

- class diagram slides
- sequence diagram slides
- state transition slides
- code skeleton slides
- test case slides

Keep longer explanations in speaker notes so slides remain readable.

## Timing

The HLD app supports:

- default slide timing
- per-slide timing
- audio-based timing during export
- pause between slides

For LLD, keep the same timing system.

LLD videos may need slightly longer defaults because code and class diagrams take more explanation.

Suggested defaults:

- title: 3 seconds
- problem/requirements: 5 seconds
- class diagram: 7 seconds
- sequence flow: 6 seconds
- code skeleton: 8 seconds
- edge cases: 6 seconds
- test cases: 6 seconds
- summary: 5 seconds

During export, generated audio should still override these defaults.

## Suggested LLD Config Example

```ts
const parkingLotLldConfig = {
  topic: "parking-lot-lld",
  title: "Design Parking Lot",
  difficulty: "medium",
  requirements: [
    "Support multiple floors",
    "Support different vehicle types",
    "Assign nearest available spot",
    "Generate ticket on entry",
    "Calculate fee on exit"
  ],
  constraints: [
    "Spot assignment should be fast",
    "Ticket state should be consistent",
    "Design should support new vehicle types"
  ],
  classes: [
    {
      id: "parkingLot",
      name: "ParkingLot",
      responsibility: "Coordinates floors, entry, and exit"
    },
    {
      id: "parkingFloor",
      name: "ParkingFloor",
      responsibility: "Tracks spots on one floor"
    },
    {
      id: "parkingSpot",
      name: "ParkingSpot",
      responsibility: "Represents one spot and its availability"
    },
    {
      id: "ticket",
      name: "ParkingTicket",
      responsibility: "Stores entry time, vehicle, spot, and status"
    },
    {
      id: "feeStrategy",
      name: "FeeCalculationStrategy",
      responsibility: "Calculates parking fee"
    }
  ],
  relationships: [
    { from: "ParkingLot", to: "ParkingFloor", type: "composition" },
    { from: "ParkingFloor", to: "ParkingSpot", type: "composition" },
    { from: "ParkingTicket", to: "Vehicle", type: "association" },
    { from: "ExitGate", to: "FeeCalculationStrategy", type: "uses" }
  ],
  flows: [
    {
      id: "vehicle-entry",
      title: "Vehicle Entry",
      steps: [
        "Vehicle arrives at entry gate",
        "System finds compatible available spot",
        "Spot is reserved",
        "Ticket is generated",
        "Gate opens"
      ]
    }
  ],
  edgeCases: [
    "No spot available",
    "Ticket lost",
    "Payment failure",
    "Vehicle type unsupported"
  ],
  testCases: [
    "Assign compact car to compact spot",
    "Do not assign truck to compact spot",
    "Calculate fee correctly for duration",
    "Reject exit for unpaid ticket"
  ]
};
```

## Recommended LLD Implementation Steps

1. Create LLD topic types.
2. Create LLD demo configs.
3. Create LLD scene types or extend the existing scene union.
4. Build `generateLldTimeline`.
5. Build LLD depth profiles.
6. Add LLD visual components for class, sequence, state, and code views.
7. Reuse the existing playback engine.
8. Reuse the existing voiceover script parser.
9. Add LLD-specific narration templates.
10. Reuse MP4 export.
11. Add LLD PPT rendering.
12. Test with at least Parking Lot, Elevator, LRU Cache, and Splitwise.

## Acceptance Criteria For LLD Version

The LLD app is ready when:

- User can select an LLD interview question.
- Timeline generates 15-25 slides per problem.
- Each slide has a clear visual and right-side explanation.
- Voiceover script is generated automatically.
- User can edit voiceover text.
- Preview reflects edited voiceover.
- PPT download works.
- MP4 export works with audio timing.
- ElevenLabs script excludes slide labels and durations.
- Class diagrams and sequence flows highlight as narration progresses.

## Main Reuse Strategy

Reuse from HLD:

- React shell
- JSON editor
- voiceover editor
- timeline playback
- export API
- audio generation
- MP4 export
- PPT download endpoint
- intro/outro composition
- slide timing system

Replace for LLD:

- topic schema
- demo configs
- scene generator
- visual components
- narration templates
- PPT slide layout for code/class diagrams

This keeps the LLD implementation small and avoids rebuilding the export system from scratch.
