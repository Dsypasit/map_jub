import React from "react"
import '../app/globals.css'

interface Customer{
    id: number
    name: string
    weight: number
    post_code: string
    size: string
}

type TableProps = {
 head: string[]
 body: Customer[]
}

export default function Table (props: TableProps){
    return (
    <table className="text-left text-sm font-light">
        <thead>
            <tr className="border-b font-medium dark:border-neutral-500">
            {props.head.map((e, i) => (
                <th className="px-6 py-4" key={i}>{e}</th>
            ))}
            </tr>
        </thead>
        <tbody>
        {props.body.map((e, i) => ( <tr className="border-b dark:border-neutral-500" key={i}>
                    <td className="whitespace-nowrap px-6 py-4 font-medium">{e.id}</td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium">{e.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium">{e.weight}</td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium">{e.post_code}</td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium">{e.size}</td>
                    </tr>
                    ))}
        </tbody>
    </table>
    )
}
