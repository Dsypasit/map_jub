import React, { useEffect, useState } from 'react';
import mockData from '../mock_data/Person.json'
import locationData from '../mock_data/post_code.json'
import Table from '../components/tableCustomer'
import '../app/globals.css'

interface Person {
    userName: string
}

interface Customer{
    id: number
    name: string
    weight: number
    post_code: string
    size: string
}

interface Location{
    location_code: string
    city: string
    kate: string
    kwang: string
    post_code: string
}

let customer_name_list: Array<Person> = JSON.parse(JSON.stringify(mockData));
let location_list: Array<Location> = JSON.parse(JSON.stringify(locationData));

function randomRange(end:number): number{
    return Math.floor(Math.random()*end+1)
}

function mockCustomer(name_list: Array<Person>): Customer[]{
    let customer_list: Customer[] = name_list.map((e, i) => ({
            id : i,
            name : e.userName,
            weight : randomRange(1100),
            size : randomRange(170).toString() +'x' + randomRange(210).toString()+'x' + randomRange(210).toString(),
            post_code : location_list[randomRange(location_list.length-1)].post_code
            }))
    console.log(customer_list)
    return customer_list
}

export default function Index(){
    let head: Array<string> = ["id", "name", "weight", "post code", "size"];
    let [customers, setCustomers] = useState<Array<Customer>>([]);
    useEffect((()=>{
                setCustomers(mockCustomer(customer_name_list));
                }), [])

    const Mock = () => {
        setCustomers(mockCustomer(customer_name_list))
    }

    return <>
        <button onClick={Mock}>Mock user</button>
        <Table head={head} body={customers} />
        </>
}
