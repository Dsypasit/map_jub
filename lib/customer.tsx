import { Customer, CustomerGroup } from "@/models/customer";
import { sumArray } from "./utils";
import { useEffect, useState } from "react";

export function groupCustomerByPostCode(customers: Customer[]): CustomerGroup[]{
    let customerPostCodes = customers.map(e => (e.post_code))
    let uniqueCustomerPostCodes = new Set(customerPostCodes)

    let customerGroups: CustomerGroup[] = Array.from(uniqueCustomerPostCodes).map(loc => ({
        post_code: loc,
        customers: customers.filter(e => e.post_code === loc)
                }));
    return customerGroups
}

export function getLocationFromResponse(data: any): string{
  let pickupAddress = data.PickupAddress
  return [pickupAddress.AddressLine1, pickupAddress.AddressLine2, pickupAddress.City, pickupAddress.State].join(" ") 
}

export function useFetchCustomerByPickupID(id: number) {
  const [customer, setCustomer] = useState<Customer>({
    pickupId: 0,
    name: "",
    phone: "",
    post_code: "",
    shipment: {
      amount: 0,
      box: []
    },
    location: ""
})
  var myHeaders = new Headers();
  myHeaders.append("CustomerId", "5223");
  myHeaders.append(
    "Authorization",
    "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiNzdjNzY3NTk2NjFiY2UwMGYxMDgwMzNiMTUzYmRhYjZkN2EzZDk4NDJhMTI1YWYyMjkyMzk0MDFiNWU3YmQwZThkZmE0NmFkMGRiNzllNzgiLCJpYXQiOjE2ODQ5MTA3NDQuNzk1ODU5LCJuYmYiOjE2ODQ5MTA3NDQuNzk1ODYzLCJleHAiOjE2ODYyMDY3NDQuNzg4MDkyLCJzdWIiOiIxOSIsInNjb3BlcyI6WyJyZWFkIl19.qVAzRrBpccZUQBbjXcxUVtxcr5UzWBcVn9OSfq7Jnm9Imy4Gh5Z3aDKp7Mn9l7_kqRivm96FYKvK-0aoZsIf9_IVyBH39Hl05uGoA14bMtCc5fHaZUPAiagZ_fhR8giSGwtNHKI3HWZMfY9F5ZW7G0Hf6ymf0dt8d4za_OXFYDd9xA-i_GDAq4te2lKH7y4xptxgztDZqxazGU3O0FHZh8cXAh-2DArlCL_rlKO6V4t3EC6B0D_NaKJTU_tDkSm-BPRqQyXsIOhY1WIYJpLiKZjhknkRSpTxZXYDH07M-HYQv4cpXg8O1oaQqftIEQD2wEtDafeZdumb4h3IIpgYyGL4NI1stLEGXOj-ibdMBjFl5i21_rGiwbk-l0YpO-V1F8dgRejgneY0S-EBzz6Q9INiXIEejEICV1fCwBv_MyVVsTKnQC3zBGqAlTK2gJeWrIXxbeLHMXNemZx6Zh-usEKzgPY6_cCRNMOd-08pcgmU9BpNJnPfbUX177_37Yl18deDNF9CtyM62Tpjcpp4200kKdFsJdfkjE8ZfijV4p7VkFTfgVXUXNV55MX9bmI6uO8ESVIV0PrR_O7-ub76np0gBZtopwg9d2sZG2cTiFj7ZUbmXsnQj_p-BOx5tegJhKidoYYXjfDH7gf_F1hAHcYj5fTjhgqXOigKF5n0tnA"
  );

  var requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  useEffect(()=>{
    getCustomer();
  }, [])

  const getCustomer = () => fetch(`https://openapi.fastship.co/api/v2/pickups/get/${id.toString()}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
        let data = result.data;
        setCustomer({
            pickupId: data.id,
            name: `${data.PickupAddress.Firstname} ${data.PickupAddress.Lastname}`,
            phone: data.PickupAddress.PhoneNumber,
            post_code: data.PickupAddress.Postcode,
            location: getLocationFromResponse(data),
            shipment: {
              amount: data.ShipmentDetail.ShipmentIds.length,
              box: []
            } 
        })
    })
    .catch((error) => console.log(error));
    return { customer,  getCustomer}
}

export async function fetchCustomerByPickupID(id: number) {
  var myHeaders = new Headers();
  myHeaders.append("CustomerId", "5223");
  myHeaders.append(
    "Authorization",
    "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiNzdjNzY3NTk2NjFiY2UwMGYxMDgwMzNiMTUzYmRhYjZkN2EzZDk4NDJhMTI1YWYyMjkyMzk0MDFiNWU3YmQwZThkZmE0NmFkMGRiNzllNzgiLCJpYXQiOjE2ODQ5MTA3NDQuNzk1ODU5LCJuYmYiOjE2ODQ5MTA3NDQuNzk1ODYzLCJleHAiOjE2ODYyMDY3NDQuNzg4MDkyLCJzdWIiOiIxOSIsInNjb3BlcyI6WyJyZWFkIl19.qVAzRrBpccZUQBbjXcxUVtxcr5UzWBcVn9OSfq7Jnm9Imy4Gh5Z3aDKp7Mn9l7_kqRivm96FYKvK-0aoZsIf9_IVyBH39Hl05uGoA14bMtCc5fHaZUPAiagZ_fhR8giSGwtNHKI3HWZMfY9F5ZW7G0Hf6ymf0dt8d4za_OXFYDd9xA-i_GDAq4te2lKH7y4xptxgztDZqxazGU3O0FHZh8cXAh-2DArlCL_rlKO6V4t3EC6B0D_NaKJTU_tDkSm-BPRqQyXsIOhY1WIYJpLiKZjhknkRSpTxZXYDH07M-HYQv4cpXg8O1oaQqftIEQD2wEtDafeZdumb4h3IIpgYyGL4NI1stLEGXOj-ibdMBjFl5i21_rGiwbk-l0YpO-V1F8dgRejgneY0S-EBzz6Q9INiXIEejEICV1fCwBv_MyVVsTKnQC3zBGqAlTK2gJeWrIXxbeLHMXNemZx6Zh-usEKzgPY6_cCRNMOd-08pcgmU9BpNJnPfbUX177_37Yl18deDNF9CtyM62Tpjcpp4200kKdFsJdfkjE8ZfijV4p7VkFTfgVXUXNV55MX9bmI6uO8ESVIV0PrR_O7-ub76np0gBZtopwg9d2sZG2cTiFj7ZUbmXsnQj_p-BOx5tegJhKidoYYXjfDH7gf_F1hAHcYj5fTjhgqXOigKF5n0tnA"
  );

  var requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const response = await fetch(`https://openapi.fastship.co/api/v2/pickups/get/${id.toString()}`, requestOptions).then((response) => response.json()).then(result => result)
  const data =response.data;
  const customer = {
            pickupId: data.ID,
            name: `${data.PickupAddress && data.PickupAddress.Firstname} ${data.PickupAddress?.Lastname}`,
            phone: data?.PickupAddress.PhoneNumber,
            post_code: data.PickupAddress.Postcode,
            location: getLocationFromResponse(data),
            shipment: {
              amount: data.ShipmentDetail.ShipmentIds.length,
              box: []
            } 
        }

    return  customer
}

export function splitSize(size: string): number[] {
  return size.split("x").map((e) => parseInt(e));
}

export function sumShipmentWeight(customer: Customer): number {
  return customer.shipment.box.reduce((pre, cur) => pre + cur.weight, 0);
}

export function sumShipmentSize(customer: Customer): number {
  return customer.shipment.box.reduce(
    (pre, cur) => pre + sumArray(splitSize(cur.size)),
    0
  );
}

export function maximumCustomerSize(customer: Customer): string {
  let customerBoxs = customer.shipment.box;
  let minValue = splitSize(customerBoxs[0].size);
  for (let box of customerBoxs) {
    let boxSize = splitSize(box.size);
    minValue[0] = Math.max(minValue[0], boxSize[0]);
    minValue[1] = Math.max(minValue[1], boxSize[1]);
    minValue[2] = Math.max(minValue[2], boxSize[2]);
  }
  return minValue.join("x");
}

export function lessBox(customerBoxSize: string, boxSize: string): boolean {
  let splitA = splitSize(customerBoxSize);
  let splitB = splitSize(boxSize);
  return (
    splitA[0] <= splitB[0] && splitA[1] <= splitB[1] && splitA[2] <= splitB[2]
  );
}

export function compareShipmentAmount(
  cusAmount: number,
  logAmount: number
): boolean {
  if (logAmount === -1) {
    return true;
  }
  return cusAmount <= logAmount;
}