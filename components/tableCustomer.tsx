import React from "react"
import '../app/globals.css'

enum Pickup{
    upcountry = "upcountry",
    makesend = "makesend",
    vicinity = "vicinity"
}


interface Customer{
    id: number
    name: string
    weight: number
    post_code: string
    size: string
    pickup?: Pickup
}

type TableProps = {
 head: string[]
 body: Customer[]
}

export default function Table (props: TableProps){
    return (
    <table className="text-left text-sm font-light min-w-fit">
        <thead>
            <tr className="border-b font-medium dark:border-neutral-500">
            {props.head.map((e, i) => (
                <th className="px-6 py-4" key={i}>{e}</th>
            ))}
            </tr>
            </thead>
            <tbody>
            {props.body.map((e, i) => (
                        <tr className={`border-b dark:border-neutral-500 ${e.pickup === Pickup.upcountry ? 'bg-red-300' : (e.pickup === Pickup.makesend ? 'bg-sky-300' : (e.pickup === Pickup.vicinity ? 'bg-green-300' : ''))}` } key={i}>
                        {Object.entries(e).map(([k, v]) => (
                                    <td className="whitespace-nowrap px-6 py-4 font-medium" key={k}>
                                    {v}
                                    </td>
                                    ))}
                        </tr>
                        ))}
            </tbody>
            </table>
            )
}
