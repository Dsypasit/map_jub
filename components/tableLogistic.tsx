import React from "react"
import '../app/globals.css'
import TdCopy from "./tdCopy"
import clipboardCopy from 'clipboard-copy';
import Dropdown from "./dropdown";
import { sumShipmentWeight } from "@/lib/customer";

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
 showCopy: () => void
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
      props.showCopy()
    } catch (error) {
      console.error("Failed to copy text to clipboard:", error);
    }
  };
  return (
    <div className="overflow-scroll ">
      <table className=" text-left text-sm font-light min-w-fit">
        <thead>
          <tr className="border-b font-medium bg-orange-400 dark:border-neutral-500">
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
              className={`${i%2==1 ? "bg-orange-300" : "bg-neutral-100"}`}
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
                <Dropdown
                  options={e.shipment.box.map((b) => b.size.toString())}
                />
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
