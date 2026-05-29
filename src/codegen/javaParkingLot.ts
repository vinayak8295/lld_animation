import type { LldCodeFile } from "../topics/topicTypes";

export const javaParkingLotSnippets: LldCodeFile[] = [
  {
    filename: "Vehicle.java",
    language: "java",
    code: `enum VehicleType {
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
}`
  },
  {
    filename: "ParkingSpot.java",
    language: "java",
    code: `class ParkingSpot {
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
}`
  },
  {
    filename: "ParkingTicket.java",
    language: "java",
    code: `class ParkingTicket {
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
}`
  },
  {
    filename: "ParkingLot.java",
    language: "java",
    code: `class ParkingLot {
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
}`
  }
];
