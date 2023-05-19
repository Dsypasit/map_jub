import React from "react"
type TableProps = {
 head: Array<string>, 
 body: Array<string> 
}
export default function Table (props: TableProps){
    return <table>
        <thead>
            <tr>
            {props.head.map((e, i) => (
                <th key={i}>e</th>
            ))}
            </tr>
        </thead>
    </table>
}