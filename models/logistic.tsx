export enum Car{
    CurierBike = "Curier Bike",
    sedan = "sedan",
    hatchBack = "hatch back",
    SUV = "SUV",
    kraba = "กระบะ",
    krabaTub = "กระบะทึบ"
}

export enum Pickup{
    upcountry = "upcountry",
    makesend = "makesend",
    vicinity = "vicinity"
}

export interface Logistic{
    car: Car
    condition: {
        shipmentAmount: number,
        box: Box
    }
}