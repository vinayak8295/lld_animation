import { javaParkingLotSnippets } from "../codegen/javaParkingLot";
import type { LldVideoConfig } from "./topicTypes";

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
    codeFiles: javaParkingLotSnippets,
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

type DemoSeed = Pick<LldVideoConfig, "topic" | "title"> & {
  requirements: string[];
  entities: LldVideoConfig["problem"]["entities"];
  relationships: LldVideoConfig["problem"]["relationships"];
  flows: LldVideoConfig["problem"]["flows"];
  patterns?: LldVideoConfig["problem"]["patterns"];
  dryRunSteps: string[];
  tradeoffs?: string[];
  mistakesToAvoid?: string[];
};

function createInterviewDemo(seed: DemoSeed): LldVideoConfig {
  return {
    template: "matrix-lld",
    topic: seed.topic,
    title: seed.title,
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
      requirements: seed.requirements,
      entities: seed.entities,
      relationships: seed.relationships,
      flows: seed.flows,
      patterns: seed.patterns ?? [],
      dryRuns: [{ title: "Example Dry Run", steps: seed.dryRunSteps }],
      tradeoffs: seed.tradeoffs ?? [],
      mistakesToAvoid: seed.mistakesToAvoid ?? []
    }
  };
}

export const elevatorSystemDemoConfig = createInterviewDemo({
  topic: "elevator-system",
  title: "Design an Elevator System",
  requirements: [
    "Support multiple elevators",
    "Accept hall and car requests",
    "Assign best elevator for a request",
    "Move elevators between floors",
    "Handle door open and close states"
  ],
  entities: [
    { id: "elevator", name: "Elevator", type: "class", responsibility: "Maintains current floor, direction, and door state", fields: ["id", "currentFloor", "direction", "state"], methods: ["moveTo(floor)", "openDoor()", "closeDoor()"] },
    { id: "request", name: "ElevatorRequest", type: "class", responsibility: "Represents a pickup or destination request", fields: ["sourceFloor", "destinationFloor", "direction"], methods: ["isHallRequest()"] },
    { id: "controller", name: "ElevatorController", type: "service", responsibility: "Assigns requests to elevators", fields: ["elevators", "assignmentStrategy"], methods: ["submitRequest(request)", "step()"] },
    { id: "strategy", name: "ElevatorAssignmentStrategy", type: "strategy", responsibility: "Chooses the best elevator for a request", methods: ["selectElevator(request, elevators)"] },
    { id: "door", name: "Door", type: "class", responsibility: "Models door state transitions", fields: ["state"], methods: ["open()", "close()"] },
    { id: "display", name: "FloorDisplay", type: "class", responsibility: "Shows current floor and direction", methods: ["update(elevator)"] }
  ],
  relationships: [
    { from: "ElevatorController", to: "Elevator", type: "has-many" },
    { from: "Elevator", to: "Door", type: "has-one" },
    { from: "ElevatorController", to: "ElevatorAssignmentStrategy", type: "uses" },
    { from: "Elevator", to: "FloorDisplay", type: "has-one" },
    { from: "ElevatorController", to: "ElevatorRequest", type: "uses" }
  ],
  flows: [
    {
      id: "hall-request",
      title: "Hall Request Flow",
      steps: [
        { actor: "Passenger", target: "ElevatorController", method: "submitRequest(upRequest)", explanation: "Passenger presses the up button on a floor." },
        { actor: "ElevatorController", target: "ElevatorAssignmentStrategy", method: "selectElevator(request, elevators)", explanation: "Controller asks the strategy for the best elevator." },
        { actor: "ElevatorController", target: "Elevator", method: "moveTo(sourceFloor)", explanation: "Selected elevator moves toward the passenger." },
        { actor: "Elevator", target: "Door", method: "open()", explanation: "Door opens when the elevator reaches the pickup floor." }
      ]
    },
    {
      id: "destination-request",
      title: "Destination Request Flow",
      steps: [
        { actor: "Passenger", target: "Elevator", method: "selectFloor(destination)", explanation: "Passenger selects a destination from inside the car." },
        { actor: "Elevator", target: "Elevator", method: "moveTo(destination)", explanation: "Elevator moves in the selected direction." },
        { actor: "Elevator", target: "FloorDisplay", method: "update(elevator)", explanation: "Display updates current floor and direction." },
        { actor: "Elevator", target: "Door", method: "open()", explanation: "Door opens at the destination floor." }
      ]
    }
  ],
  patterns: [
    { name: "Strategy", usedIn: "ElevatorAssignmentStrategy", reason: "Different scheduling algorithms can be plugged in without changing the controller." },
    { name: "State", usedIn: "Elevator", reason: "Elevator movement and door behavior depend on current state." }
  ],
  dryRunSteps: [
    "Passenger on floor 3 presses Up.",
    "Controller selects elevator E2 because it is already moving upward nearby.",
    "E2 moves to floor 3 and opens the door.",
    "Passenger selects floor 8.",
    "E2 moves to floor 8 and opens the door."
  ],
  tradeoffs: ["Nearest elevator vs collective control", "Single controller vs per-elevator controller", "Simple polling loop vs event-driven simulation"],
  mistakesToAvoid: ["Ignoring direction during assignment", "Mixing scheduling logic inside Elevator", "Skipping door state handling"]
});

export const splitwiseDemoConfig = createInterviewDemo({
  topic: "splitwise",
  title: "Design Splitwise",
  requirements: [
    "Create users and groups",
    "Add expenses paid by one or more users",
    "Split expenses equally or by percentage",
    "Track balances between users",
    "Simplify settlements"
  ],
  entities: [
    { id: "user", name: "User", type: "class", responsibility: "Represents a participant in expenses", fields: ["id", "name", "email"], methods: ["getId()"] },
    { id: "group", name: "Group", type: "class", responsibility: "Groups users and expenses", fields: ["members", "expenses"], methods: ["addMember(user)", "addExpense(expense)"] },
    { id: "expense", name: "Expense", type: "class", responsibility: "Captures amount, payer, and splits", fields: ["amount", "paidBy", "splits"], methods: ["validateSplits()"] },
    { id: "split", name: "Split", type: "class", responsibility: "Represents each user's share", fields: ["user", "amount"], methods: ["getAmount()"] },
    { id: "balanceSheet", name: "BalanceSheet", type: "repository", responsibility: "Stores who owes whom", fields: ["balances"], methods: ["recordDebt(from, to, amount)", "getBalances(user)"] },
    { id: "splitStrategy", name: "SplitStrategy", type: "strategy", responsibility: "Calculates splits for equal, exact, or percentage modes", methods: ["createSplits(amount, users)"] }
  ],
  relationships: [
    { from: "Group", to: "User", type: "has-many" },
    { from: "Group", to: "Expense", type: "has-many" },
    { from: "Expense", to: "Split", type: "has-many" },
    { from: "Expense", to: "User", type: "has-one", label: "paid by" },
    { from: "Expense", to: "SplitStrategy", type: "uses" },
    { from: "BalanceSheet", to: "User", type: "depends-on" }
  ],
  flows: [
    {
      id: "add-expense",
      title: "Add Expense Flow",
      steps: [
        { actor: "User", target: "Group", method: "addExpense(expense)", explanation: "A group member records a new expense." },
        { actor: "Expense", target: "SplitStrategy", method: "createSplits(amount, users)", explanation: "Expense delegates split calculation to the selected strategy." },
        { actor: "Expense", target: "Expense", method: "validateSplits()", explanation: "Expense verifies that split amounts add up to the total." },
        { actor: "Group", target: "BalanceSheet", method: "recordDebt(member, payer, share)", explanation: "Group updates balances for each participant." }
      ]
    },
    {
      id: "settle-up",
      title: "Settle Up Flow",
      steps: [
        { actor: "User", target: "BalanceSheet", method: "getBalances(user)", explanation: "User asks for outstanding balances." },
        { actor: "BalanceSheet", target: "BalanceSheet", method: "simplifyDebts()", explanation: "System reduces redundant debts." },
        { actor: "User", target: "BalanceSheet", method: "recordPayment(from, to, amount)", explanation: "Payment reduces the balance between two users." }
      ]
    }
  ],
  patterns: [{ name: "Strategy", usedIn: "SplitStrategy", reason: "Split rules vary by equal, exact, percentage, and shares." }],
  dryRunSteps: ["A pays 1200 for A, B, and C.", "Equal split creates three shares of 400.", "B owes A 400.", "C owes A 400.", "Balance sheet shows A should receive 800."],
  tradeoffs: ["Pairwise balance map vs transaction ledger", "Real-time simplification vs on-demand simplification", "Exact decimal arithmetic vs floating point"],
  mistakesToAvoid: ["Using double for money", "Forgetting split validation", "Mixing UI concerns into expense calculation"]
});

export const bookMyShowDemoConfig = createInterviewDemo({
  topic: "bookmyshow",
  title: "Design BookMyShow",
  requirements: [
    "Search movies and shows by city",
    "Display theatres and showtimes",
    "Allow seat selection",
    "Lock seats during checkout",
    "Confirm booking after payment"
  ],
  entities: [
    { id: "movie", name: "Movie", type: "class", responsibility: "Stores movie metadata", fields: ["id", "title", "duration"], methods: ["getTitle()"] },
    { id: "theatre", name: "Theatre", type: "class", responsibility: "Owns screens and location", fields: ["id", "city", "screens"], methods: ["getShows(movie)"] },
    { id: "show", name: "Show", type: "class", responsibility: "Represents a movie screening on a screen", fields: ["movie", "screen", "startTime"], methods: ["availableSeats()"] },
    { id: "seat", name: "Seat", type: "class", responsibility: "Represents a physical seat and booking state", fields: ["seatNumber", "seatType", "status"], methods: ["lock()", "book()", "release()"] },
    { id: "booking", name: "Booking", type: "class", responsibility: "Tracks selected seats, amount, and status", fields: ["id", "user", "show", "seats", "status"], methods: ["confirm()", "expire()"] },
    { id: "bookingService", name: "BookingService", type: "service", responsibility: "Coordinates seat locking, payment, and confirmation", methods: ["createBooking(show, seats)", "confirmPayment(booking)"] },
    { id: "seatLockProvider", name: "SeatLockProvider", type: "service", responsibility: "Temporarily locks seats to avoid double booking", methods: ["lockSeats(show, seats)", "releaseExpiredLocks()"] }
  ],
  relationships: [
    { from: "Theatre", to: "Show", type: "has-many" },
    { from: "Show", to: "Movie", type: "has-one" },
    { from: "Show", to: "Seat", type: "has-many" },
    { from: "Booking", to: "Show", type: "has-one" },
    { from: "Booking", to: "Seat", type: "has-many" },
    { from: "BookingService", to: "SeatLockProvider", type: "uses" }
  ],
  flows: [
    {
      id: "book-seats",
      title: "Book Seats Flow",
      steps: [
        { actor: "User", target: "BookingService", method: "createBooking(show, seats)", explanation: "User selects seats for a show." },
        { actor: "BookingService", target: "SeatLockProvider", method: "lockSeats(show, seats)", explanation: "Service locks seats for a short checkout window." },
        { actor: "BookingService", target: "Booking", method: "createPendingBooking()", explanation: "A pending booking is created while payment is in progress." },
        { actor: "User", target: "BookingService", method: "confirmPayment(booking)", explanation: "Successful payment confirms the booking." },
        { actor: "Booking", target: "Seat", method: "book()", explanation: "Seats are permanently marked booked." }
      ]
    },
    {
      id: "lock-expiry",
      title: "Seat Lock Expiry Flow",
      steps: [
        { actor: "Scheduler", target: "SeatLockProvider", method: "releaseExpiredLocks()", explanation: "A background job finds locks past their TTL." },
        { actor: "SeatLockProvider", target: "Seat", method: "release()", explanation: "Expired seats become available again." }
      ]
    }
  ],
  patterns: [{ name: "Repository", usedIn: "BookingService", reason: "Bookings and seat locks need consistent storage boundaries." }],
  dryRunSteps: ["User selects A1 and A2 for a 7 PM show.", "Seats are locked for five minutes.", "Pending booking is created.", "Payment succeeds.", "Seats become booked and lock is cleared."],
  tradeoffs: ["Pessimistic locks vs optimistic booking", "In-memory locks vs distributed lock store", "Single booking service vs separate payment orchestration"],
  mistakesToAvoid: ["Not expiring seat locks", "Allowing double booking", "Treating payment success and booking confirmation as one atomic local operation"]
});

export const atmMachineDemoConfig = createInterviewDemo({
  topic: "atm-machine",
  title: "Design an ATM Machine",
  requirements: [
    "Authenticate card and PIN",
    "Support balance enquiry",
    "Withdraw cash",
    "Dispense notes using available denominations",
    "Handle insufficient balance or cash"
  ],
  entities: [
    { id: "atm", name: "ATM", type: "singleton", responsibility: "Coordinates ATM sessions and hardware modules", fields: ["state", "cashDispenser", "bankService"], methods: ["insertCard(card)", "selectOperation(operation)"] },
    { id: "card", name: "Card", type: "class", responsibility: "Represents card identity and account link", fields: ["cardNumber", "accountId"], methods: ["getAccountId()"] },
    { id: "account", name: "Account", type: "class", responsibility: "Stores balance and withdrawal rules", fields: ["accountId", "balance"], methods: ["debit(amount)", "hasBalance(amount)"] },
    { id: "bankService", name: "BankService", type: "service", responsibility: "Validates PIN and updates account balance", methods: ["authenticate(card, pin)", "withdraw(account, amount)"] },
    { id: "cashDispenser", name: "CashDispenser", type: "service", responsibility: "Dispenses notes based on denomination inventory", fields: ["cashInventory"], methods: ["canDispense(amount)", "dispense(amount)"] },
    { id: "atmState", name: "ATMState", type: "abstract-class", responsibility: "Defines allowed actions for each ATM state", methods: ["insertCard()", "enterPin()", "withdraw()"] }
  ],
  relationships: [
    { from: "ATM", to: "ATMState", type: "has-one" },
    { from: "ATM", to: "BankService", type: "uses" },
    { from: "ATM", to: "CashDispenser", type: "has-one" },
    { from: "Card", to: "Account", type: "has-one" },
    { from: "BankService", to: "Account", type: "uses" }
  ],
  flows: [
    {
      id: "withdraw-cash",
      title: "Withdraw Cash Flow",
      steps: [
        { actor: "Customer", target: "ATM", method: "insertCard(card)", explanation: "Customer starts a session by inserting a card." },
        { actor: "ATM", target: "BankService", method: "authenticate(card, pin)", explanation: "ATM verifies the PIN through the bank service." },
        { actor: "Customer", target: "ATM", method: "selectOperation(WITHDRAW)", explanation: "Customer chooses withdrawal and enters amount." },
        { actor: "ATM", target: "BankService", method: "withdraw(account, amount)", explanation: "Bank service checks balance and debits the account." },
        { actor: "ATM", target: "CashDispenser", method: "dispense(amount)", explanation: "Cash dispenser releases notes if inventory is available." }
      ]
    },
    {
      id: "failed-withdrawal",
      title: "Failed Withdrawal Flow",
      steps: [
        { actor: "ATM", target: "BankService", method: "withdraw(account, amount)", explanation: "Bank rejects withdrawal if balance is insufficient." },
        { actor: "ATM", target: "CashDispenser", method: "canDispense(amount)", explanation: "ATM also checks whether it has enough cash." },
        { actor: "ATM", target: "Customer", method: "showFailure(reason)", explanation: "Customer sees a clear failure reason and card is returned." }
      ]
    }
  ],
  patterns: [
    { name: "State", usedIn: "ATMState", reason: "Allowed operations depend on whether card, PIN, or transaction state is active." },
    { name: "Chain of Responsibility", usedIn: "CashDispenser", reason: "Different note denominations can dispense parts of the amount." }
  ],
  dryRunSteps: ["Card is inserted.", "PIN is authenticated.", "Customer requests 2000.", "Account is debited.", "Cash dispenser returns matching notes."],
  tradeoffs: ["Local ATM cash inventory vs bank account truth", "Rollback when cash dispense fails after debit", "State pattern vs conditional workflow"],
  mistakesToAvoid: ["Debiting before dispense without compensation", "Skipping ATM state transitions", "Ignoring denomination availability"]
});

export const vendingMachineDemoConfig = createInterviewDemo({
  topic: "vending-machine",
  title: "Design a Vending Machine",
  requirements: [
    "Display available products",
    "Accept coins or notes",
    "Select product",
    "Dispense product after sufficient payment",
    "Return change or refund on cancel"
  ],
  entities: [
    { id: "machine", name: "VendingMachine", type: "singleton", responsibility: "Coordinates product selection, payment, and dispense", fields: ["state", "inventory", "balance"], methods: ["selectProduct(code)", "insertMoney(amount)", "dispense()"] },
    { id: "product", name: "Product", type: "class", responsibility: "Represents an item sold by the machine", fields: ["code", "name", "price"], methods: ["getPrice()"] },
    { id: "inventory", name: "Inventory", type: "repository", responsibility: "Tracks product stock by code", fields: ["items"], methods: ["hasStock(code)", "decrement(code)"] },
    { id: "payment", name: "Payment", type: "class", responsibility: "Tracks inserted amount and change", fields: ["amountPaid"], methods: ["addMoney(amount)", "refund()"] },
    { id: "machineState", name: "MachineState", type: "abstract-class", responsibility: "Controls allowed actions by machine state", methods: ["selectProduct()", "insertMoney()", "dispense()"] }
  ],
  relationships: [
    { from: "VendingMachine", to: "MachineState", type: "has-one" },
    { from: "VendingMachine", to: "Inventory", type: "has-one" },
    { from: "Inventory", to: "Product", type: "has-many" },
    { from: "VendingMachine", to: "Payment", type: "has-one" }
  ],
  flows: [
    {
      id: "buy-product",
      title: "Buy Product Flow",
      steps: [
        { actor: "Customer", target: "VendingMachine", method: "selectProduct(A1)", explanation: "Customer selects a product code." },
        { actor: "VendingMachine", target: "Inventory", method: "hasStock(A1)", explanation: "Machine verifies that product is available." },
        { actor: "Customer", target: "VendingMachine", method: "insertMoney(amount)", explanation: "Customer inserts money until price is met." },
        { actor: "VendingMachine", target: "Inventory", method: "decrement(A1)", explanation: "Inventory is reduced before dispense." },
        { actor: "VendingMachine", target: "Customer", method: "dispenseProductAndChange()", explanation: "Machine dispenses product and returns change." }
      ]
    },
    {
      id: "cancel-purchase",
      title: "Cancel Purchase Flow",
      steps: [
        { actor: "Customer", target: "VendingMachine", method: "cancel()", explanation: "Customer cancels before dispense." },
        { actor: "VendingMachine", target: "Payment", method: "refund()", explanation: "Machine returns inserted money." },
        { actor: "VendingMachine", target: "MachineState", method: "reset()", explanation: "Machine returns to idle state." }
      ]
    }
  ],
  patterns: [{ name: "State", usedIn: "MachineState", reason: "Selections, payment, and dispense are valid only in specific states." }],
  dryRunSteps: ["Customer selects Coke A1.", "Machine checks stock.", "Customer inserts 50.", "Price is 40, so item is dispensed.", "Machine returns 10 as change."],
  tradeoffs: ["State pattern vs simple conditionals", "Exact change support vs limited denominations", "Inventory consistency during dispense failure"],
  mistakesToAvoid: ["Dispensing before payment is sufficient", "Not refunding on cancel", "Forgetting out-of-stock state"]
});

export const snakeAndLadderDemoConfig = createInterviewDemo({
  topic: "snake-and-ladder",
  title: "Design Snake and Ladder",
  requirements: [
    "Support multiple players",
    "Roll dice turn by turn",
    "Move players across a board",
    "Apply snakes and ladders",
    "Declare winner on reaching final cell"
  ],
  entities: [
    { id: "game", name: "Game", type: "class", responsibility: "Runs the turn loop and winner detection", fields: ["board", "players", "dice"], methods: ["start()", "playTurn(player)"] },
    { id: "board", name: "Board", type: "class", responsibility: "Stores cells and jumps", fields: ["size", "jumps"], methods: ["getNextPosition(position)"] },
    { id: "player", name: "Player", type: "class", responsibility: "Tracks player identity and position", fields: ["name", "position"], methods: ["moveTo(position)"] },
    { id: "dice", name: "Dice", type: "class", responsibility: "Generates dice values", fields: ["faces"], methods: ["roll()"] },
    { id: "jump", name: "Jump", type: "class", responsibility: "Represents snake or ladder start and end", fields: ["start", "end"], methods: ["isSnake()", "isLadder()"] }
  ],
  relationships: [
    { from: "Game", to: "Board", type: "has-one" },
    { from: "Game", to: "Player", type: "has-many" },
    { from: "Game", to: "Dice", type: "has-one" },
    { from: "Board", to: "Jump", type: "has-many" }
  ],
  flows: [
    {
      id: "player-turn",
      title: "Player Turn Flow",
      steps: [
        { actor: "Game", target: "Dice", method: "roll()", explanation: "Game rolls dice for the current player." },
        { actor: "Game", target: "Player", method: "moveTo(nextPosition)", explanation: "Player moves by dice value if within board bounds." },
        { actor: "Game", target: "Board", method: "getNextPosition(position)", explanation: "Board applies snake or ladder jumps." },
        { actor: "Board", target: "Player", method: "moveTo(jumpEnd)", explanation: "Player lands on final jump destination." },
        { actor: "Game", target: "Game", method: "checkWinner(player)", explanation: "Game ends if player reaches final cell." }
      ]
    },
    {
      id: "next-turn",
      title: "Next Turn Flow",
      steps: [
        { actor: "Game", target: "Game", method: "advanceTurn()", explanation: "If no winner exists, game moves to the next player." },
        { actor: "Game", target: "Player", method: "currentPlayer()", explanation: "Turn order is maintained in a queue." }
      ]
    }
  ],
  patterns: [{ name: "Factory", usedIn: "Game", reason: "Board setup can be created from config for different game variants." }],
  dryRunSteps: ["Player A rolls 4.", "A moves from 1 to 5.", "Cell 5 has ladder to 14.", "A moves to 14.", "Turn passes to Player B."],
  tradeoffs: ["Exact finish required vs allow overshoot", "Single dice vs multiple dice", "Configured board vs hardcoded jumps"],
  mistakesToAvoid: ["Forgetting jump after move", "Not checking board bounds", "Mixing UI loop with game rules"]
});

export const cacheLruDemoConfig = createInterviewDemo({
  topic: "cache-lru",
  title: "Design an LRU Cache",
  requirements: [
    "Support get in O(1)",
    "Support put in O(1)",
    "Evict least recently used key when capacity is full",
    "Update recency on get and put",
    "Support configurable capacity"
  ],
  entities: [
    { id: "cache", name: "LRUCache", type: "class", responsibility: "Coordinates hashmap and doubly linked list", fields: ["capacity", "map", "list"], methods: ["get(key)", "put(key, value)"] },
    { id: "node", name: "CacheNode", type: "class", responsibility: "Stores key, value, and list pointers", fields: ["key", "value", "prev", "next"], methods: ["detach()", "attachAfter(head)"] },
    { id: "list", name: "DoublyLinkedList", type: "class", responsibility: "Maintains recency order", fields: ["head", "tail"], methods: ["moveToFront(node)", "removeLast()"] },
    { id: "eviction", name: "EvictionPolicy", type: "strategy", responsibility: "Defines which entry to evict", methods: ["onAccess(node)", "evict()"] }
  ],
  relationships: [
    { from: "LRUCache", to: "CacheNode", type: "has-many" },
    { from: "LRUCache", to: "DoublyLinkedList", type: "has-one" },
    { from: "DoublyLinkedList", to: "CacheNode", type: "has-many" },
    { from: "LRUCache", to: "EvictionPolicy", type: "uses" }
  ],
  flows: [
    {
      id: "get-key",
      title: "Get Key Flow",
      steps: [
        { actor: "Client", target: "LRUCache", method: "get(key)", explanation: "Client asks for a key." },
        { actor: "LRUCache", target: "LRUCache", method: "map.get(key)", explanation: "Hashmap lookup finds the node in O(1)." },
        { actor: "LRUCache", target: "DoublyLinkedList", method: "moveToFront(node)", explanation: "Accessed node becomes most recently used." },
        { actor: "LRUCache", target: "Client", method: "return value", explanation: "Cache returns the stored value." }
      ]
    },
    {
      id: "put-key",
      title: "Put Key Flow",
      steps: [
        { actor: "Client", target: "LRUCache", method: "put(key, value)", explanation: "Client inserts or updates a key." },
        { actor: "LRUCache", target: "DoublyLinkedList", method: "moveToFront(node)", explanation: "Updated or new node becomes most recent." },
        { actor: "LRUCache", target: "DoublyLinkedList", method: "removeLast()", explanation: "If capacity is exceeded, tail node is evicted." },
        { actor: "LRUCache", target: "LRUCache", method: "map.remove(evictedKey)", explanation: "Hashmap entry is removed for the evicted node." }
      ]
    }
  ],
  patterns: [{ name: "Strategy", usedIn: "EvictionPolicy", reason: "LRU can be swapped with LFU or FIFO in an extensible cache." }],
  dryRunSteps: ["Capacity is 2.", "put(1,A), put(2,B).", "get(1) moves key 1 to front.", "put(3,C) evicts key 2.", "get(2) returns -1."],
  tradeoffs: ["Custom list vs LinkedHashMap", "Thread-safe cache vs single-threaded cache", "Generic key/value support vs typed cache"],
  mistakesToAvoid: ["Forgetting to update recency on get", "Removing from list but not map", "Making eviction O(n)"]
});

export const loggingFrameworkDemoConfig = createInterviewDemo({
  topic: "logging-framework",
  title: "Design a Logging Framework",
  requirements: [
    "Support log levels",
    "Route logs to multiple appenders",
    "Format messages consistently",
    "Allow runtime configuration",
    "Filter messages below configured level"
  ],
  entities: [
    { id: "logger", name: "Logger", type: "singleton", responsibility: "Entry point for application logs", fields: ["level", "appenders"], methods: ["info(message)", "error(message)", "log(level, message)"] },
    { id: "logEvent", name: "LogEvent", type: "class", responsibility: "Immutable log record", fields: ["level", "message", "timestamp", "threadName"], methods: ["getLevel()"] },
    { id: "appender", name: "Appender", type: "interface", responsibility: "Writes log events to a destination", methods: ["append(event)"] },
    { id: "consoleAppender", name: "ConsoleAppender", type: "class", responsibility: "Writes logs to console", methods: ["append(event)"], implements: ["Appender"] },
    { id: "fileAppender", name: "FileAppender", type: "class", responsibility: "Writes logs to a file", fields: ["filePath"], methods: ["append(event)"], implements: ["Appender"] },
    { id: "formatter", name: "Formatter", type: "strategy", responsibility: "Converts log events to text", methods: ["format(event)"] }
  ],
  relationships: [
    { from: "Logger", to: "Appender", type: "has-many" },
    { from: "ConsoleAppender", to: "Appender", type: "implements" },
    { from: "FileAppender", to: "Appender", type: "implements" },
    { from: "Appender", to: "Formatter", type: "uses" },
    { from: "Logger", to: "LogEvent", type: "creates" }
  ],
  flows: [
    {
      id: "write-log",
      title: "Write Log Flow",
      steps: [
        { actor: "Application", target: "Logger", method: "info(message)", explanation: "Application writes an info log." },
        { actor: "Logger", target: "Logger", method: "isEnabled(level)", explanation: "Logger filters logs below the configured level." },
        { actor: "Logger", target: "LogEvent", method: "create(level, message)", explanation: "Logger creates an immutable event." },
        { actor: "Logger", target: "Appender", method: "append(event)", explanation: "Event is sent to each configured appender." },
        { actor: "Appender", target: "Formatter", method: "format(event)", explanation: "Appender formats the event before writing." }
      ]
    },
    {
      id: "change-config",
      title: "Change Config Flow",
      steps: [
        { actor: "Admin", target: "Logger", method: "setLevel(DEBUG)", explanation: "Runtime configuration changes the minimum log level." },
        { actor: "Admin", target: "Logger", method: "addAppender(fileAppender)", explanation: "A new destination is added without changing application code." }
      ]
    }
  ],
  patterns: [
    { name: "Singleton", usedIn: "Logger", reason: "Applications usually use a shared logger registry or manager." },
    { name: "Strategy", usedIn: "Formatter", reason: "Formatting can vary by plain text, JSON, or structured output." }
  ],
  dryRunSteps: ["Application calls logger.info.", "Logger checks INFO is enabled.", "LogEvent is created.", "Console and file appenders receive the event.", "Formatter creates final output text."],
  tradeoffs: ["Synchronous vs asynchronous appenders", "Global logger vs named logger registry", "File rotation as appender responsibility vs separate policy"],
  mistakesToAvoid: ["Blocking hot paths with slow file I/O", "Using mutable log events", "Hardcoding one output destination"]
});

export const rateLimiterDemoConfig = createInterviewDemo({
  topic: "rate-limiter-lld",
  title: "Design a Rate Limiter",
  requirements: [
    "Limit requests per user or API key",
    "Support fixed window or token bucket algorithms",
    "Return allow or reject decision",
    "Expire old counters",
    "Work with distributed storage"
  ],
  entities: [
    { id: "limiter", name: "RateLimiter", type: "service", responsibility: "Evaluates each request against a configured policy", fields: ["policy", "store"], methods: ["allow(request)"] },
    { id: "request", name: "RequestContext", type: "class", responsibility: "Identifies caller, endpoint, and timestamp", fields: ["key", "endpoint", "timestamp"], methods: ["getLimitKey()"] },
    { id: "policy", name: "RateLimitPolicy", type: "class", responsibility: "Stores max requests and window configuration", fields: ["limit", "windowMs"], methods: ["getLimit()"] },
    { id: "algorithm", name: "RateLimitAlgorithm", type: "strategy", responsibility: "Implements fixed window, sliding window, or token bucket", methods: ["allow(context, policy, store)"] },
    { id: "store", name: "RateLimitStore", type: "repository", responsibility: "Persists counters or buckets", methods: ["increment(key)", "get(key)", "expire(key)"] }
  ],
  relationships: [
    { from: "RateLimiter", to: "RateLimitAlgorithm", type: "uses" },
    { from: "RateLimiter", to: "RateLimitPolicy", type: "has-one" },
    { from: "RateLimiter", to: "RateLimitStore", type: "uses" },
    { from: "RateLimiter", to: "RequestContext", type: "uses" }
  ],
  flows: [
    {
      id: "allow-request",
      title: "Allow Request Flow",
      steps: [
        { actor: "API Gateway", target: "RateLimiter", method: "allow(context)", explanation: "Gateway asks whether the request can proceed." },
        { actor: "RateLimiter", target: "RateLimitAlgorithm", method: "allow(context, policy, store)", explanation: "Limiter delegates algorithm-specific decisions." },
        { actor: "RateLimitAlgorithm", target: "RateLimitStore", method: "increment(key)", explanation: "Store atomically updates the caller counter or bucket." },
        { actor: "RateLimitAlgorithm", target: "RateLimiter", method: "return decision", explanation: "Algorithm returns allow or reject." }
      ]
    },
    {
      id: "reject-request",
      title: "Reject Request Flow",
      steps: [
        { actor: "RateLimitAlgorithm", target: "RateLimitStore", method: "get(key)", explanation: "Algorithm reads current usage." },
        { actor: "RateLimitAlgorithm", target: "RateLimiter", method: "reject(retryAfter)", explanation: "Request is rejected with retry-after metadata." },
        { actor: "RateLimiter", target: "API Gateway", method: "429 Too Many Requests", explanation: "Gateway returns a throttling response." }
      ]
    }
  ],
  patterns: [{ name: "Strategy", usedIn: "RateLimitAlgorithm", reason: "Algorithms differ but the public allow API stays stable." }],
  dryRunSteps: ["Limit is 3 requests per minute.", "User sends requests 1, 2, and 3.", "Each request is allowed.", "Fourth request arrives in the same window.", "Limiter rejects with retry-after."],
  tradeoffs: ["Fixed window vs sliding window accuracy", "In-memory store vs Redis", "Atomic increments vs race conditions"],
  mistakesToAvoid: ["Non-atomic counter updates", "No expiration for old keys", "One global limit for every endpoint"]
});

export const foodDeliveryDemoConfig = createInterviewDemo({
  topic: "food-delivery-app",
  title: "Design a Food Delivery App",
  requirements: [
    "Search restaurants by location",
    "Build cart and place order",
    "Track order states",
    "Assign delivery partner",
    "Support payment and cancellation"
  ],
  entities: [
    { id: "restaurant", name: "Restaurant", type: "class", responsibility: "Owns menu and accepts orders", fields: ["id", "name", "menu"], methods: ["acceptOrder(order)", "rejectOrder(order)"] },
    { id: "menuItem", name: "MenuItem", type: "class", responsibility: "Represents a sellable food item", fields: ["name", "price", "available"], methods: ["isAvailable()"] },
    { id: "cart", name: "Cart", type: "class", responsibility: "Collects selected items before checkout", fields: ["items"], methods: ["addItem(item)", "total()"] },
    { id: "order", name: "Order", type: "class", responsibility: "Tracks order items, customer, restaurant, and status", fields: ["id", "status", "items"], methods: ["markAccepted()", "markDelivered()"] },
    { id: "deliveryPartner", name: "DeliveryPartner", type: "class", responsibility: "Represents a partner assigned for pickup and delivery", fields: ["id", "location", "availability"], methods: ["assign(order)"] },
    { id: "orderService", name: "OrderService", type: "service", responsibility: "Coordinates checkout, restaurant acceptance, and delivery assignment", methods: ["placeOrder(cart)", "cancelOrder(order)"] },
    { id: "assignmentStrategy", name: "DeliveryAssignmentStrategy", type: "strategy", responsibility: "Chooses a delivery partner", methods: ["assign(order, partners)"] }
  ],
  relationships: [
    { from: "Restaurant", to: "MenuItem", type: "has-many" },
    { from: "Cart", to: "MenuItem", type: "has-many" },
    { from: "Order", to: "Restaurant", type: "has-one" },
    { from: "Order", to: "DeliveryPartner", type: "has-one" },
    { from: "OrderService", to: "DeliveryAssignmentStrategy", type: "uses" }
  ],
  flows: [
    {
      id: "place-order",
      title: "Place Order Flow",
      steps: [
        { actor: "Customer", target: "Cart", method: "addItem(item)", explanation: "Customer adds menu items to cart." },
        { actor: "Customer", target: "OrderService", method: "placeOrder(cart)", explanation: "Customer checks out the cart." },
        { actor: "OrderService", target: "Restaurant", method: "acceptOrder(order)", explanation: "Restaurant confirms it can prepare the order." },
        { actor: "OrderService", target: "DeliveryAssignmentStrategy", method: "assign(order, partners)", explanation: "Service finds a suitable delivery partner." },
        { actor: "DeliveryPartner", target: "Order", method: "markDelivered()", explanation: "Order is completed after delivery." }
      ]
    },
    {
      id: "cancel-order",
      title: "Cancel Order Flow",
      steps: [
        { actor: "Customer", target: "OrderService", method: "cancelOrder(order)", explanation: "Customer requests cancellation." },
        { actor: "OrderService", target: "Order", method: "canCancel()", explanation: "Service checks whether cancellation is allowed for current state." },
        { actor: "OrderService", target: "Restaurant", method: "notifyCancellation(order)", explanation: "Restaurant is notified if the order is cancelled." }
      ]
    }
  ],
  patterns: [
    { name: "State", usedIn: "Order", reason: "Order behavior changes across placed, accepted, prepared, picked, delivered, and cancelled." },
    { name: "Strategy", usedIn: "DeliveryAssignmentStrategy", reason: "Partner assignment can optimize by distance, rating, or load." }
  ],
  dryRunSteps: ["Customer adds biryani to cart.", "OrderService places order.", "Restaurant accepts.", "Nearest delivery partner is assigned.", "Order moves to delivered."],
  tradeoffs: ["Order state machine vs enum checks", "Synchronous checkout vs event-driven workflow", "Nearest partner vs load-aware assignment"],
  mistakesToAvoid: ["Skipping order state validation", "Assigning partner before restaurant acceptance", "Ignoring cancellation windows"]
});

export const interviewDemoConfigs: Partial<Record<LldVideoConfig["topic"], LldVideoConfig>> = {
  "parking-lot": parkingLotDemoConfig,
  "elevator-system": elevatorSystemDemoConfig,
  splitwise: splitwiseDemoConfig,
  bookmyshow: bookMyShowDemoConfig,
  "atm-machine": atmMachineDemoConfig,
  "vending-machine": vendingMachineDemoConfig,
  "snake-and-ladder": snakeAndLadderDemoConfig,
  "cache-lru": cacheLruDemoConfig,
  "logging-framework": loggingFrameworkDemoConfig,
  "rate-limiter-lld": rateLimiterDemoConfig,
  "food-delivery-app": foodDeliveryDemoConfig
};

export const interviewDemoTopicOptions = Object.values(interviewDemoConfigs).filter(Boolean).map((config) => ({
  topic: config.topic,
  title: config.title
}));

export const supportedDemoTopics = Object.keys(interviewDemoConfigs) as LldVideoConfig["topic"][];
