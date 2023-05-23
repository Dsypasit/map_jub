import React from "react"
import '../app/globals.css'
import TdCopy from "./tdCopy"
import clipboardCopy from 'clipboard-copy';
import Dropdown from "./dropdown";

enum Pickup{
    upcountry = "upcountry",
    makesend = "makesend",
    vicinity = "vicinity"
}

interface Shipment {
    amount: number
    box: Box[]
}

interface Box{
    size: string
    weight: number
}

interface Customer{
    id: number
    name: string
    post_code: string
    shipment: Shipment
    location: string
    pickup?: Pickup
}


type TableProps = {
 head: string[]
 body: Customer[]|undefined
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


function sumShipmentWeight(customer: Customer): number{
    return customer.shipment.box.reduce((pre, cur) => pre+cur.weight, 0)
}

function sumShipmentSize(customer: Customer): number{
    return customer.shipment.box.reduce((pre, cur) => pre + sumArray(splitSize(cur.size)), 0)
}

function splitSize(size: string): number[]{
    return size.split("x").map(e => parseInt(e))
}

function sumArray(arr: number[]): number {
    return arr.reduce((pre, cur) => pre+cur, 0)
}

export default function TableLogistic (props: TableProps){
  const handleCopyClick = async (
    event: React.MouseEvent<HTMLTableCellElement>
  ) => {
    let text = event.currentTarget.innerText;
    console.log(text);
    try {
      await clipboardCopy(text);
      console.log("Text copied to clipboard:", text);
    } catch (error) {
      console.error("Failed to copy text to clipboard:", error);
    }
  };
  return (
    <div className="overflow-scroll">
      <table className=" text-left text-sm font-light min-w-fit">
        <thead>
          <tr className="border-b font-medium dark:border-neutral-500">
            {props.head.map((e, i) => (
              <th className="px-6 py-4" key={i}>
                {e}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.body?.map((e, i) => (
            <tr
              className={`border-b dark:border-neutral-500 ${
                e.pickup === Pickup.upcountry
                  ? "bg-red-300"
                  : e.pickup === Pickup.makesend
                  ? "bg-sky-300"
                  : e.pickup === Pickup.vicinity
                  ? "bg-green-300"
                  : ""
              }`}
              key={i}
            >
              <td
                onClick={handleCopyClick}
                className="whitespace-nowrap cursor-default hover:bg-slate-300 px-6 py-4 font-medium"
              >
                {e.id}
              </td>
              <td
                onClick={handleCopyClick}
                className="whitespace-nowrap cursor-default hover:bg-slate-300 px-6 py-4 font-medium"
              >
              {e.name}
              </td>
              <td
                onClick={handleCopyClick}
                className="whitespace-nowrap cursor-default hover:bg-slate-300 px-6 py-4 font-medium"
              >
              {sumShipmentWeight(e)}
              </td>
              <td
                onClick={handleCopyClick}
                className="whitespace-nowrap cursor-default hover:bg-slate-300 px-6 py-4 font-medium"
              >
              <Dropdown options={e.shipment.box.map(b=>b.size.toString())}/>
              </td>
              <td
                onClick={handleCopyClick}
                className="whitespace-nowrap cursor-default hover:bg-slate-300 px-6 py-4 font-medium"
              >
              {e.shipment.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
