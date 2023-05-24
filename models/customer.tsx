interface Person {
    userName: string
}

interface Customer{
    id: number
    name: string
    post_code: string
    shipment: Shipment
    location: string
    pickup?: Pickup
}

interface Shipment {
    amount: number
    box: Box[]
}

interface Box{
    size: string
    weight: number
}

interface Location{
    location_code: string
    city: string
    kate: string
    kwang: string
    post_code: string
}

interface CustomerGroup{
    post_code: string
    customers: Customer[]
}

interface LogisticCustomers{
    logistic: Logistic | null
    postcode: string
    sumWeight: number
    sumShipment: number
    customers: Customer[]
}
