import { Logistic, Pickup } from "./logistic"

export interface Person {
    userName: string
}

export interface Customer{
    pickupId: number
    name: string
    phone: string
    post_code: string
    shipment: Shipment
    location: string
    pickup?: Pickup
}

export interface Shipment {
    amount: number
    box: Box[]
}

export interface Box{
    size: string
    weight: number
}

export interface Location{
    location_code: string
    city: string
    kate: string
    kwang: string
    post_code: string
}

export interface CustomerGroup{
    post_code: string
    customers: Customer[]
}

export interface LogisticCustomers{
    postcode: string
    sumWeight: number
    sumShipment: number
    carGroups: carGroups[]
}

export interface carGroups {
    logistic: Logistic | null
    totalWeight: number
    customers: Customer[]
}