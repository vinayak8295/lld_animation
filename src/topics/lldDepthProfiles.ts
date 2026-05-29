import type { LldDepthProfile, LldVideoConfig } from "./topicTypes";

export const genericLldDepthProfile: LldDepthProfile = {
  publicMethods: [
    "Expose small use-case methods that map to interview requirements.",
    "Keep validation at the service boundary and state mutation inside domain objects.",
    "Return explicit success, failure, or domain result objects."
  ],
  classResponsibilities: [
    "Each class should own one meaningful domain responsibility.",
    "Coordinator services orchestrate objects but do not absorb all business rules.",
    "Repositories or stores hide persistence details from domain workflows."
  ],
  interfaces: [
    "Introduce interfaces where behavior changes by strategy or external integration.",
    "Keep interface methods narrow and domain-oriented.",
    "Use implementations to isolate rules that are likely to vary."
  ],
  relationships: [
    "Prefer composition for owned child objects.",
    "Use dependency relationships for services and strategies.",
    "Use inheritance only for true is-a abstractions."
  ],
  designPatterns: [
    "Use Strategy for replaceable rules.",
    "Use State for workflows with constrained transitions.",
    "Use Factory when creation has branching rules."
  ],
  dataStructures: [
    "Map for direct lookup by id.",
    "List or queue for ordered workflows.",
    "Set for uniqueness checks."
  ],
  objectLifecycle: [
    "Create domain object from validated input.",
    "Move through explicit state changes.",
    "Persist or publish important state changes after mutation."
  ],
  stateTransitions: [
    "Idle -> Active when a request starts.",
    "Active -> Completed when all required steps finish.",
    "Active -> Failed when validation or resource allocation fails."
  ],
  validationRules: [
    "Reject unsupported input before mutating state.",
    "Validate availability before assigning resources.",
    "Validate state before allowing an operation."
  ],
  errorHandling: [
    "Return domain-specific errors for invalid state.",
    "Release temporary resources on failure.",
    "Keep failure messages actionable for callers."
  ],
  concurrencyConcerns: [
    "Guard shared mutable state with locks or atomic operations.",
    "Make allocation operations idempotent where possible.",
    "Avoid double assignment of scarce resources."
  ],
  extensibilityPoints: [
    "Add new rules through strategies.",
    "Add new entity variants without changing coordinators.",
    "Keep rendering/API concerns outside the domain model."
  ],
  testCases: [
    "Happy path creates the expected state changes.",
    "Invalid input is rejected without mutation.",
    "Concurrent requests do not allocate the same resource twice."
  ],
  tradeoffs: [
    "Simple in-memory model vs persistent storage.",
    "Central coordinator vs smaller domain services.",
    "Explicit state machine vs enum checks in methods."
  ],
  interviewPitfalls: [
    "Putting every method in one manager class.",
    "Drawing classes without proving a sequence flow.",
    "Skipping edge cases and concurrency on shared resources."
  ]
};

const overrides: Partial<Record<LldVideoConfig["topic"], Partial<LldDepthProfile>>> = {
  "parking-lot": {
    dataStructures: ["Map floorId to ParkingFloor.", "Priority queue or ordered list for nearest available spots.", "Map ticketId to active ParkingTicket."],
    stateTransitions: ["SpotAvailable -> SpotReserved on entry.", "SpotReserved -> SpotOccupied after vehicle parks.", "SpotOccupied -> SpotAvailable after paid exit."],
    concurrencyConcerns: ["Lock spot assignment per floor.", "Prevent two gates from reserving the same spot.", "Make ticket creation idempotent for retries."]
  },
  "elevator-system": {
    dataStructures: ["Queue pending hall requests.", "Set destination floors per elevator.", "List elevators managed by the controller."],
    stateTransitions: ["Idle -> Moving when assigned.", "Moving -> DoorOpen at target floor.", "DoorOpen -> Idle or Moving after close."],
    concurrencyConcerns: ["Synchronize request assignment.", "Avoid assigning one elevator to conflicting directions.", "Handle simultaneous hall and car requests."]
  },
  "cache-lru": {
    dataStructures: ["HashMap key to node for O(1) lookup.", "Doubly linked list for recency order.", "Head and tail sentinels for constant-time moves."],
    stateTransitions: ["Missing -> Inserted on put.", "Inserted -> MostRecent on get.", "LeastRecent -> Evicted when capacity is exceeded."],
    concurrencyConcerns: ["Guard map and list updates together.", "Avoid stale node pointers after eviction.", "Use read/write locks or synchronized methods for thread-safe variants."]
  },
  splitwise: {
    dataStructures: ["Map user pair to balance.", "List expenses per group.", "Decimal money type for exact amounts."],
    stateTransitions: ["ExpenseDraft -> ExpenseRecorded after split validation.", "DebtOpen -> DebtReduced after payment.", "DebtReduced -> Settled when balance reaches zero."],
    concurrencyConcerns: ["Update all participant balances atomically.", "Avoid duplicate expense submission on retry.", "Use immutable money values."]
  },
  bookmyshow: {
    dataStructures: ["Map showId to seat inventory.", "Seat lock map with expiry time.", "Booking records by bookingId."],
    stateTransitions: ["SeatAvailable -> SeatLocked during checkout.", "SeatLocked -> SeatBooked after payment.", "SeatLocked -> SeatAvailable after lock expiry."],
    concurrencyConcerns: ["Lock selected seats atomically.", "Expire abandoned locks.", "Confirm booking only if lock owner matches the payment session."]
  },
  "atm-machine": {
    stateTransitions: ["Idle -> CardInserted.", "CardInserted -> Authenticated after valid PIN.", "Authenticated -> DispensingCash after withdrawal request.", "DispensingCash -> Idle after eject card."],
    concurrencyConcerns: ["Keep account debit and cash dispense compensatable.", "Synchronize cash inventory updates.", "Reject duplicate withdrawal retries after success."]
  },
  "vending-machine": {
    stateTransitions: ["Idle -> ProductSelected.", "ProductSelected -> PaymentAccepted.", "PaymentAccepted -> Dispensing.", "Dispensing -> Idle after product and change are returned."],
    concurrencyConcerns: ["Prevent stock decrement races.", "Refund payment if dispense fails.", "Keep inserted balance scoped to one session."]
  },
  "snake-and-ladder": {
    dataStructures: ["Queue players for turn order.", "Map cell number to jump.", "Board size as final winning position."],
    stateTransitions: ["WaitingTurn -> RollingDice.", "RollingDice -> Moved.", "Moved -> Winner or WaitingTurn."],
    concurrencyConcerns: ["Single game loop owns turn mutation.", "Reject moves when it is not the player's turn.", "Keep dice rolls deterministic in tests."]
  },
  "logging-framework": {
    dataStructures: ["List appenders per logger.", "Enum for log levels.", "Immutable LogEvent object."],
    concurrencyConcerns: ["Appender writes may need async queues.", "Runtime configuration updates must be thread-safe.", "File appenders must serialize writes."]
  },
  "rate-limiter-lld": {
    dataStructures: ["Map limit key to counter or token bucket.", "Expiry timestamp per window.", "Policy map by endpoint or user tier."],
    concurrencyConcerns: ["Counter increments must be atomic.", "Distributed stores need compare-and-set or Lua scripts.", "Clock skew affects window boundaries."]
  },
  "food-delivery-app": {
    stateTransitions: ["Created -> Accepted.", "Accepted -> Preparing.", "Preparing -> PickedUp.", "PickedUp -> Delivered.", "Created or Accepted -> Cancelled when allowed."],
    concurrencyConcerns: ["Avoid assigning one partner to conflicting orders.", "Handle restaurant rejection after payment authorization.", "Make order state transitions idempotent."]
  }
};

export function getLldDepthProfile(topic: LldVideoConfig["topic"]): LldDepthProfile {
  return {
    ...genericLldDepthProfile,
    ...(overrides[topic] ?? {})
  };
}
