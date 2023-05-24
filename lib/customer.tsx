import { sumArray } from "./utils";

export function groupCustomerByPostCode(customers: Customer[]): CustomerGroup[]{
    let customerPostCodes = customers.map(e => (e.post_code))
    let uniqueCustomerPostCodes = new Set(customerPostCodes)

    let customerGroups: CustomerGroup[] = Array.from(uniqueCustomerPostCodes).map(loc => ({
        post_code: loc,
        customers: customers.filter(e => e.post_code === loc)
                }));
    return customerGroups
}

export function splitSize(size: string): number[]{
    return size.split("x").map(e => parseInt(e))
}

export function sumShipmentWeight(customer: Customer): number{
    return customer.shipment.box.reduce((pre, cur) => pre+cur.weight, 0)
}

export function sumShipmentSize(customer: Customer): number{
    return customer.shipment.box.reduce((pre, cur) => pre + sumArray(splitSize(cur.size)), 0)
}

export function maximumCustomerSize(customer: Customer): string{
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

export function lessBox(customerBoxSize: string, boxSize: string): boolean {
  let splitA = splitSize(customerBoxSize);
  let splitB = splitSize(boxSize);
  return (
    splitA[0] <= splitB[0] && splitA[1] <= splitB[1] && splitA[2] <= splitB[2]
  );
}

export function compareShipmentAmount(cusAmount:number, logAmount:number): boolean{
    if (logAmount === -1){
        return true
    }
    return cusAmount <= logAmount
}