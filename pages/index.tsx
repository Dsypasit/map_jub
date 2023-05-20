import React, { useEffect, useState } from 'react';
import mockData from '../mock_data/Person.json'
import locationData from '../mock_data/post_code.json'
import Table from '../components/tableCustomer'
import '../app/globals.css'

enum Car{
    CurierBike = "Curier Bike",
    sedan = "sedan",
    hatchBack = "hatch back",
    SUV = "SUV",
    kraba = "กระบะ",
    krabaTub = "กระบะทึบ"
}

enum Pickup{
    upcountry = "upcountry",
    makesend = "makesend",
    vicinity = "vicinity"
}

interface Person {
    userName: string
}

interface Customer{
    id: number
    name: string
    weight: number
    post_code: string
    size: string
    location: string
    pickup?: Pickup
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

let customer_name_list: Array<Person> = JSON.parse(JSON.stringify(mockData));
let location_list: Array<Location> = JSON.parse(JSON.stringify(locationData));

function randomRange(end:number): number{
    return Math.floor(Math.random()*end+1)
}

function bangkokAndVicinityCode(location: Location[]) :string[]{
    let bangkok_and_vicinity = ["กรุงเทพมหานคร", "นนทบุรี", "สมุทรปราการ", "ปทุมธานี"]
    return location.filter(e => bangkok_and_vicinity.includes(e.city)).map(e => e.post_code)
}

function isBangkokAndVicinity(customer: Customer): boolean{
    return bangkokAndVicinityCode(location_list).includes(customer.post_code)
}

function groupCustomerByPostCode(customers: Customer[]): CustomerGroup[]{
    let customerPostCodes = customers.map(e => (e.post_code))
    let uniqueCustomerPostCodes = new Set(customerPostCodes)

    let customerGroups: CustomerGroup[] = Array.from(uniqueCustomerPostCodes).map(loc => ({
        post_code: loc,
        customers: customers.filter(e => e.post_code === loc)
                }));
    return customerGroups
}

function splitSize(size: string): number[]{
    return size.split("x").map(e => parseInt(e))
}

function pickup(customer: Customer): Pickup{
    if (!isBangkokAndVicinity(customer)){
        return Pickup.upcountry
    }else if(customer.weight<=25 && splitSize(customer.size).reduce((pre, cur) => pre+cur, 0) <= 200){
        return Pickup.makesend
    }
    return Pickup.vicinity
}

function pickupCustomers(customers: Customer[]): Customer[]{
    return customers.map(e => ({
        ...e, pickup: pickup(e)
                }))
}

// function pickupVicinity(customer: Customer): Cars{
//
// }

function mockCustomer(name_list: Array<Person>): Customer[]{
    let customer_list: Customer[] = name_list.map((e, i) => { 
            const locIndex = randomRange(location_list.length-1);
            return {
                id : i,
                name : e.userName,
                weight : randomRange(100),
                size : randomRange(170).toString() +'x' + randomRange(210).toString()+'x' + randomRange(210).toString(),
                post_code : location_list[locIndex].post_code,
                location: location_list[locIndex].city
            } ;
    });
    return customer_list.slice(0, 10)
    }

export default function Index(){
    let [customers, setCustomers] = useState<Array<Customer>>([]);
    let [head, setHead] = useState<string[]>(["id", "name", "weight", "post code", "size", "location"]);
    useEffect((()=>{
                setCustomers(mockCustomer(customer_name_list));
                }), [])

    const Mock = () => {
        setCustomers(pickupCustomers(mockCustomer(customer_name_list)))
        setHead(["id", "name", "weight", "post code", "size", "location", "group"])
    }

    const updateTable = () => {
        setCustomers(pickupCustomers(customers))
        setHead(["id", "name", "weight", "post code", "size", "location", "group"])
            console.log(head)
            console.log(customers)
    }

    return <>
        <div className="flex w-full justify-center mt-10">
        <button className='bg-sky-500 mr-4 px-5 py-5 rounded-lg' onClick={Mock}>Mock user</button>
        <button className='bg-sky-500 px-5 rounded-lg' onClick={updateTable}>Group</button>
        </div>
        <div className='flex justify-center mt-5'>
            <Table head={head} body={customers} />
        </div>
        </>
}
