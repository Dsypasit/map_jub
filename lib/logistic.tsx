import {
  compareShipmentAmount,
  lessBox,
  maximumCustomerSize,
  splitSize,
  sumShipmentSize,
  sumShipmentWeight,
} from "./customer";
import locationData from "../mock_data/post_code.json";
import { Car, Logistic, Pickup } from "@/models/logistic";
import {
  Customer,
  CustomerGroup,
  Location,
  LogisticCustomers,
  carGroups,
} from "@/models/customer";
import { sumArray } from "./utils";

export let location_list: Array<Location> = JSON.parse(
  JSON.stringify(locationData)
);

let allCars: Logistic[] = [
  {
    car: Car.CurierBike,
    condition: {
      shipmentAmount: 4,
      box: {
        size: "50x50x50",
        weight: 20,
      },
    },
  },
  {
    car: Car.sedan,
    condition: {
      shipmentAmount: 5,
      box: {
        size: "90x100x75",
        weight: 100,
      },
    },
  },
  {
    car: Car.hatchBack,
    condition: {
      shipmentAmount: 5,
      box: {
        size: "115x115x80",
        weight: 200,
      },
    },
  },
  {
    car: Car.SUV,
    condition: {
      shipmentAmount: 7,
      box: {
        size: "130x160x80",
        weight: 300,
      },
    },
  },
  {
    car: Car.kraba,
    condition: {
      shipmentAmount: -1,
      box: {
        size: "170x180x90",
        weight: 1100,
      },
    },
  },
  {
    car: Car.krabaTub,
    condition: {
      shipmentAmount: -1,
      box: {
        size: "170x210x210",
        weight: 1100,
      },
    },
  },
];

export function pickupCustomers(customers: Customer[]): Customer[] {
  return customers.map((e) => ({
    ...e,
    pickup: pickup(e),
  }));
}

function pickup(customer: Customer): Pickup {
  if (!isBangkokAndVicinity(customer)) {
    return Pickup.upcountry;
  } else if (
    customer.shipment.amount <= 3 &&
    sumShipmentWeight(customer) <= 25 &&
    sumShipmentSize(customer) <= 200
  ) {
    return Pickup.makesend;
  }
  return Pickup.vicinity;
}

function bangkokAndVicinityCode(location: Location[]): string[] {
  let bangkok_and_vicinity = [
    "กรุงเทพมหานคร",
    "นนทบุรี",
    "สมุทรปราการ",
    "ปทุมธานี",
  ];
  return location
    .filter((e) => bangkok_and_vicinity.includes(e.city))
    .map((e) => e.post_code);
}

export function isBangkokAndVicinity(customer: Customer): boolean {
  return bangkokAndVicinityCode(location_list).includes(customer.post_code);
}

export function selectCars(customerGroup: CustomerGroup): LogisticCustomers {
  let sumWeight = customerGroup.customers.reduce(
    (pre, cur) => pre + sumShipmentWeight(cur),
    0
  );
  let sumShipment = customerGroup.customers.reduce(
    (pre, cur) => pre + cur.shipment.amount,
    0
  );
  let splitCustomers = [];

  let filterCars = allCars.filter((e) =>
    compareShipmentAmount(sumShipment, e.condition.shipmentAmount)
  );

  let w = 0;
  let group: Customer[] = [];
  let customersSorted = [...customerGroup.customers].sort(
    (a, b) => sumShipmentWeight(b) - sumShipmentWeight(a)
  );
  customersSorted = [...customerGroup.customers].sort(
    (a, b) =>
      Math.min(...splitSize(maximumCustomerSize(b))) -
      Math.min(...splitSize(maximumCustomerSize(a)))
  );
  for (let i = 0; i < customersSorted.length; i++) {
    w += sumShipmentWeight(customersSorted[i]);
    if (w < 1100) {
      group.push(customersSorted[i]);
    } else {
      w = 0;
      splitCustomers.push(group);
      group = [customersSorted[i]];
    }
  }
  if (group.length != 0) {
    splitCustomers.push(group);
  }
  console.log(
    splitCustomers.map((sc) =>
      sc.reduce((pre, cur) => pre + sumShipmentWeight(cur), 0)
    )
  );

  let carGroups: carGroups[] = [];
  for (let customers of splitCustomers) {
    let selectIndex = 0;
    for (let customer of customers) {
      let customerSize = maximumCustomerSize(customer);
      while (selectIndex < filterCars.length) {
        let boxSize = filterCars[selectIndex].condition.box.size;
        if (lessBox(customerSize, boxSize)) {
          break;
        }
        selectIndex++;
      }
      if (!(selectIndex < filterCars.length))
        return {
          carGroups,
          postcode: customerGroup.post_code,
          sumWeight,
          sumShipment,
        };
    }
    carGroups.push({
      logistic: filterCars[selectIndex],
      customers: customers,
      totalWeight: sumArray(customers.map(c=>sumShipmentWeight(c)))
    });
  }
  return {
    carGroups,
    postcode: customerGroup.post_code,
    sumWeight,
    sumShipment,
  };
}
