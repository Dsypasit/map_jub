import mockData from '../mock_data/Person.json'

interface Person {
    name: string
}

const Mock = () => {
    customer_list: Array<Person> = JSON.parse(JSON.stringify(mockData))
    for(let i=0; i<100; i++){
    }
}
export default function Index(){
    return <>
    <button onClick={Mock}>Mock user</button>
    </>
}