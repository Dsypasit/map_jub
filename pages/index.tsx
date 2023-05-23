import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import mockData from '../mock_data/Person.json'
import locationData from '../mock_data/post_code.json'
import Table from '../components/tableCustomer'
import '../app/globals.css'
import TableLogistic from '../components/tableLogistic';

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

interface Logistic{
    car: Car
    condition: {
        shipmentAmount: number,
        box: Box
    }
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

let customer_name_list: Array<Person> = JSON.parse(JSON.stringify(mockData));
let location_list: Array<Location> = JSON.parse(JSON.stringify(locationData));
let allCars : Logistic[] = [
    {
        car: Car.CurierBike,
        condition: {
            shipmentAmount: 4,
            box: {
                size: "50x50x50",
                weight: 20
            }
        }

    },
    {
        car: Car.sedan,
        condition: {
            shipmentAmount: 5,
            box: {
                size: "90x100x75",
                weight: 100
            }
        }

    },
    {
        car: Car.hatchBack,
        condition: {
            shipmentAmount: 5,
            box: {
                size: "115x115x80",
                weight: 200
            }
        }

    },
    {
        car: Car.SUV,
        condition: {
            shipmentAmount: 7,
            box: {
                size: "130x160x80",
                weight: 300
            }
        }

    },
    {
        car: Car.kraba,
        condition: {
            shipmentAmount: -1,
            box: {
                size: "170x180x90",
                weight: 1100
            }
        }

    },
    {
        car: Car.krabaTub,
        condition: {
            shipmentAmount: -1,
            box: {
                size: "170x210x210",
                weight: 1100
            }
        }

    },
]  

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
    }else if(customer.shipment.amount <= 3 && sumShipmentWeight(customer)<=25 && sumShipmentSize(customer) <= 200){
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

function sumShipmentWeight(customer: Customer): number{
    return customer.shipment.box.reduce((pre, cur) => pre+cur.weight, 0)
}

function sumShipmentSize(customer: Customer): number{
    return customer.shipment.box.reduce((pre, cur) => pre + sumArray(splitSize(cur.size)), 0)
}

function sumArray(arr: number[]): number {
    return arr.reduce((pre, cur) => pre+cur, 0)
}

function mockShipment(): Shipment{
    let amount = randomRange(5)
    let box: Box[] = [];
    for (let i=0; i< amount; i++){
        box.push({ 
            weight : randomRange(100),
            size : randomRange(170).toString() +'x' + randomRange(150).toString()+'x' + randomRange(90).toString(),
         })
    }
    return {
        amount, box
    }
}

function mockCustomer(name_list: Array<Person>): Customer[]{
    let customer_list: Customer[] = name_list.map((e, i) => { 
            const locIndex = randomRange(location_list.length-1);
            return {
                id : i,
                name : e.userName,
                shipment: mockShipment(),
                post_code : location_list[locIndex].post_code,
                location: location_list[locIndex].city
            } ;
    });
    return customer_list.slice(0, 50)
}

function maximumCustomerSize(customer: Customer): string{
    let customerBoxs = customer.shipment.box;
    let minValue = splitSize(customerBoxs[0].size)
    for (let box of customerBoxs){
        let boxSize = splitSize(box.size)
        minValue[0] = Math.max(minValue[0], boxSize[0])
        minValue[1] = Math.max(minValue[1], boxSize[1])
        minValue[2] = Math.max(minValue[2], boxSize[2])
    }
    return minValue.join("x")
}

function lessBox(customerBoxSize: string, boxSize: string): boolean{
    let splitA = splitSize(customerBoxSize)
    let splitB = splitSize(boxSize)
    return (splitA[0] <= splitB[0] &&
splitA[1] <= splitB[1] &&
splitA[2] <= splitB[2] 
)
}

function compareShipmentAmount(cusAmount:number, logAmount:number): boolean{
    if (logAmount === -1){
        return true
    }
    return cusAmount <= logAmount
}

function selectCars(customerGroup: CustomerGroup): LogisticCustomers {
    let sumWeight = customerGroup.customers.reduce((pre, cur) => pre+sumShipmentWeight(cur), 0)
    let sumShipment = customerGroup.customers.reduce((pre, cur) => pre+cur.shipment.amount, 0)
    let splitCustomers = []

    let filterCars = allCars.filter((e) => (
        compareShipmentAmount(sumShipment, e.condition.shipmentAmount) &&
        sumWeight <= e.condition.box.weight
    ))

    if (sumWeight>1100){
        let w=0;
        let group: Customer[] = [];
        let customersSorted = [...customerGroup.customers].sort((a, b) => sumShipmentWeight(b) - sumShipmentWeight(a))
        for(let i=0; i< customersSorted.length; i++){
            w += sumShipmentWeight(customersSorted[i])
            if (w < 1100){
                group.push(customersSorted[i])
            }else{
                w = 0
                splitCustomers.push(group)
                group = [customersSorted[i]]
            }
        }
        if (group.length != 0){
            splitCustomers.push(group)
        }
    }

    let selectIndex = 0
    for (let customer of customerGroup.customers){
        let customerSize = maximumCustomerSize(customer)
        while(selectIndex<filterCars.length){
            let boxSize = filterCars[selectIndex].condition.box.size
            if (lessBox(customerSize, boxSize)){
                break
            }
            selectIndex++
        }
        if (!(selectIndex<filterCars.length)) return {
        logistic: null,
        postcode: customerGroup.post_code,
        sumWeight,
        sumShipment,
        customers: customerGroup.customers
        }
    }
    return {
        logistic: filterCars[selectIndex],
        postcode: customerGroup.post_code,
        sumWeight,
        sumShipment,
        customers: customerGroup.customers
    }
}

export default function Index(){
  let [customers, setCustomers] = useState<Array<Customer>>([]);
  let [logisticCustomer, setLogisticCustomer] = useState<LogisticCustomers[]>([]);
  let [selectPostcode, setSelectPostCode] = useState<string[]>([])
  let [selectCustomer, setSelectCustomer] = useState<LogisticCustomers|undefined>()
  let [postCode, setPostCode] = useState<string>('')
  let [group, setGroup] = useState<boolean>(false)
  let postCodeRef = useRef<HTMLSelectElement>(null)
  let [head, setHead] = useState<string[]>([]);
  useEffect(() => {
    Mock();
  }, []);

  const Mock = () => {
    setCustomers(pickupCustomers(mockCustomer(customer_name_list)));
    setHead(["id", "name", "post code", "weight", "size", "location", "group", "shipment amount"]);
    let customersGroups = groupCustomerByPostCode(
      customers.filter((e) => isBangkokAndVicinity(e) && e.pickup===Pickup.vicinity)
    );
    setLogisticCustomer(customersGroups.map((e) => selectCars(e)));
    setSelectPostCode(customersGroups.map(e => e.post_code))
    setPostCode('')
    setGroup(false)
  };

  const updateTable = () => {
    setCustomers(pickupCustomers(customers));
    setHead(["id", "name", "post code", "weight", "size", "shipment amount"]);
    let customersGroups = groupCustomerByPostCode(
      customers.filter((e) => isBangkokAndVicinity(e) && e.pickup===Pickup.vicinity)
    );
    setLogisticCustomer(customersGroups.map((e) => selectCars(e)));
    setSelectPostCode(customersGroups.map(e => e.post_code))
    setPostCode('')
    setGroup(true)
  };

  const handleSelectPostCode = (e:ChangeEvent<HTMLSelectElement>) => {
    if (!postCodeRef.current){
        return
    }
    setHead(["id", "name", "post code", "weight", "size", "location", "group", "shipment amount"]);
    setPostCode(postCodeRef.current.value)
    setSelectCustomer(logisticCustomer.filter(l => l.postcode == postCodeRef.current?.value)[0])
  }

  return (
    <>
      <div className="flex w-full justify-center mt-10">
        <button className="bg-sky-500 mr-4 px-5 py-5 rounded-lg" onClick={Mock}>
          Mock user
        </button>
        <button className="bg-sky-500 px-5 mr-4 rounded-lg" onClick={updateTable}>
          Group
        </button>
        <select
          id="countries"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={handleSelectPostCode}
          value={postCode}
          ref={postCodeRef}
        >
          <option selected>choose post code</option>
          {selectPostcode.map((code, index) => (
            <option key={index} value={code}>{code}</option>
          ))}
        </select>
      </div>
        {group ? 
        <div className='grid grid-cols-3'>
            {
                <div className='flex flex-col text-center mx-5 my-5'>
                    <h1>{Pickup.makesend}</h1>
                    <TableLogistic head={head} body={customers.filter(cus => cus.pickup === Pickup.makesend)}/>
                </div>
            }
            {logisticCustomer.map((l, index) => (
                <div key={index} className='flex flex-col text-center mx-5 my-5'>
                    <h1>{l.postcode}</h1>
                    <h1>จังหวัด: {location_list.find(ll => ll.post_code == l.postcode)?.city}</h1>
                    <h1>ขวาง: {location_list.find(ll => ll.post_code == l.postcode)?.kwang}</h1>
                    <h1>เขต: {location_list.find(ll => ll.post_code == l.postcode)?.kate}</h1>
                    <h1>ขวาง: {location_list.find(ll => ll.post_code == l.postcode)?.kwang}</h1>
                    <h1>จำนวนshipment: {l.sumShipment}</h1>
                    <h1>weight: {l.sumWeight}</h1>
                    <h1>cars: {l.logistic?.car}</h1>
                    <TableLogistic head={head} body={l.customers}/>
                </div>
            ))}
        </div>
        
    : null}
      <div className="flex justify-center mt-5">
        {postCode ==='' ?  <Table head={head} body={customers} /> :
        (
            <div>
            <h1>Cars: {selectCustomer?.logistic?.car}</h1>
            <h1>sum weight: {selectCustomer?.sumWeight}</h1>
            <h1>condition-shipAmount: {selectCustomer?.logistic?.condition.shipmentAmount}</h1>
            <h1>condition-box size: {selectCustomer?.logistic?.condition.box.size}</h1>
            <h1>condition-box weight: {selectCustomer?.logistic?.condition.box.weight}</h1>
            {<Table head={head} body={selectCustomer?.customers}/>}
            </div>
        )
  }
      </div>
    </>
  );
}
