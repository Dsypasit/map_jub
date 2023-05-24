import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import mockData from '../mock_data/Person.json'
import locationData from '../mock_data/post_code.json'
import Table from '../components/tableCustomer'
import '../app/globals.css'
import TableLogistic from '../components/tableLogistic';
import { randomRange } from '@/lib/utils';
import { isBangkokAndVicinity, location_list, pickupCustomers, selectCars } from '@/lib/logistic';
import { groupCustomerByPostCode } from '@/lib/customer';
import { Pickup } from '@/models/logistic';
import { Shipment, Box, Customer, LogisticCustomers } from '@/models/customer';

interface Person {
    userName: string
}

let customer_name_list: Array<Person> = JSON.parse(JSON.stringify(mockData));

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

export default function Index() {
  let [customers, setCustomers] = useState<Array<Customer>>([]);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  let [logisticCustomer, setLogisticCustomer] = useState<LogisticCustomers[]>(
    []
  );
  let [selectPostcode, setSelectPostCode] = useState<string[]>([]);
  let [selectCustomer, setSelectCustomer] = useState<
    LogisticCustomers | undefined
  >();
  let [postCode, setPostCode] = useState<string>("");
  let [group, setGroup] = useState<boolean>(false);
  let postCodeRef = useRef<HTMLSelectElement>(null);
  let [head, setHead] = useState<string[]>([]);
  useEffect(() => {
    Mock();
  }, []);

  const Mock = () => {
    setCustomers(pickupCustomers(mockCustomer(customer_name_list)));
    setHead([
      "id",
      "name",
      "weight",
      "size",
      "location",
      "group",
      "shipment amount",
    ]);
    let customersGroups = groupCustomerByPostCode(
      customers.filter(
        (e) => isBangkokAndVicinity(e) && e.pickup === Pickup.vicinity
      )
    );
    setLogisticCustomer(customersGroups.map((e) => selectCars(e)));
    setSelectPostCode(customersGroups.map((e) => e.post_code));
    setPostCode("");
    setGroup(false);
  };

  const updateTable = () => {
    setCustomers(pickupCustomers(customers));
    setHead(["id", "name", "weight", "size", "shipment amount"]);
    let customersGroups = groupCustomerByPostCode(
      customers.filter(
        (e) => isBangkokAndVicinity(e) && e.pickup === Pickup.vicinity
      )
    );
    setLogisticCustomer(customersGroups.map((e) => selectCars(e)));
    setSelectPostCode(customersGroups.map((e) => e.post_code));
    setPostCode("");
    setGroup(true);
    window.dataLayer.push({
      event: "group",
      customer_id: "abcde",
      price: randomRange(5000),
      shipment_type: ["car", "plane", "boat"][randomRange(3)],
    });
  };

  const handleCopyClick = () => {
    setShowCopiedMessage(true);
    setTimeout(() => {
      setShowCopiedMessage(false);
    }, 700);
  };

  const handleSelectPostCode = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!postCodeRef.current) {
      return;
    }
    setHead([
      "id",
      "name",
      "weight",
      "size",
      "location",
      "group",
      "shipment amount",
    ]);
    setPostCode(postCodeRef.current.value);
    setSelectCustomer(
      logisticCustomer.filter(
        (l) => l.postcode == postCodeRef.current?.value
      )[0]
    );
  };

  return (
    <>
      <div
        className={`z-50 bg-blue-400 px-5 py-4 rounded-lg fixed bottom-4 right-0 ${
          showCopiedMessage ? "" : "hidden"
        }`}
        role="alert"
      >
        <p className="">copied!</p>
      </div>
      <div className="flex w-full justify-center mt-10">
        <button
          id="mock-btn"
          className="bg-sky-500 mr-4 px-5 py-5 rounded-lg"
          onClick={Mock}
        >
          Mock user
        </button>
        <button
          className="bg-sky-500 px-5 mr-4 rounded-lg"
          onClick={updateTable}
        >
          Group
        </button>
      </div>
      {group ? (
        <div className="grid grid-cols-2">
          {
            <div className="flex flex-col text-center mx-5 my-5 border rounded-lg p-3 bg-gray-100">
              <h1>{Pickup.makesend}</h1>
              <TableLogistic
                showCopy={handleCopyClick}
                head={head}
                body={customers.filter((cus) => cus.pickup === Pickup.makesend)}
              />
            </div>
          }
          {logisticCustomer.map((l, index) => (
            <div
              key={index}
              className="flex flex-col text-center mx-5 my-5 border rounded-lg p-3 bg-gray-100"
            >
              <h1>{l.postcode}</h1>
              <h1>
                จังหวัด:{" "}
                {location_list.find((ll) => ll.post_code == l.postcode)?.city}
              </h1>
              <h1>
                แขวง:{" "}
                {location_list.find((ll) => ll.post_code == l.postcode)?.kwang}
              </h1>
              <h1>
                เขต:{" "}
                {location_list.find((ll) => ll.post_code == l.postcode)?.kate}
              </h1>
              <h1>จำนวนshipment: {l.sumShipment}</h1>
              <h1>รวม weight : {l.sumWeight}</h1>
              <h1>cars: {l.logistic?.car}</h1>
              <TableLogistic
                head={head}
                body={l.customers}
                showCopy={handleCopyClick}
              />
            </div>
          ))}
        </div>
      ) : null}
      <div className="flex justify-center mt-5">
        {postCode === "" ? (
          <Table head={head} body={customers} />
        ) : (
          <div>
            <h1>Cars: {selectCustomer?.logistic?.car}</h1>
            <h1>sum weight: {selectCustomer?.sumWeight}</h1>
            <h1>
              condition-shipAmount:{" "}
              {selectCustomer?.logistic?.condition.shipmentAmount}
            </h1>
            <h1>
              condition-box size: {selectCustomer?.logistic?.condition.box.size}
            </h1>
            <h1>
              condition-box weight:{" "}
              {selectCustomer?.logistic?.condition.box.weight}
            </h1>
            {<Table head={head} body={selectCustomer?.customers} />}
          </div>
        )}
      </div>
    </>
  );
}
