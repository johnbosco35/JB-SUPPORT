import Customer from "./models/Customer";
import Order from "./models/Order";

const people = [
  "Amara Okafor", "Liam Chen", "Sofia Rossi", "Noah Williams", "Zainab Bello", "Ethan Park", "Chloe Dubois", "Tunde Adeyemi",
  "Maya Patel", "Lucas Silva", "Grace Mensah", "Oliver Brown", "Ines Costa", "Daniel Kim", "Hannah Weiss",
];

// [order number, customer index, item, amount, days ago, final sale, already refunded]
const orders: [string, number, string, number, number, boolean, boolean][] = [
  ["ORD-1001", 0, "Ceramic pour-over set", 64, 5, false, false],
  ["ORD-1002", 1, "Noise-cancelling headphones", 249, 12, false, false],
  ["ORD-1003", 2, "Leather weekender bag", 180, 50, false, false],
  ["ORD-1004", 3, "Clearance denim jacket", 45, 8, true, false],
  ["ORD-1005", 4, "Standing desk", 780, 10, false, false],
  ["ORD-1006", 5, "Mechanical keyboard", 139, 3, false, false],
  ["ORD-1007", 6, "Linen duvet set", 210, 25, false, false],
  ["ORD-1008", 7, "Espresso machine", 620, 6, false, false],
  ["ORD-1009", 8, "Yoga mat", 58, 40, false, false],
  ["ORD-1010", 9, "Smart watch", 329, 14, false, false],
  ["ORD-1011", 10, "Final sale wool scarf", 39, 4, true, false],
  ["ORD-1012", 11, "Trail running shoes", 120, 20, false, false],
  ["ORD-1013", 12, "Bluetooth speaker", 89, 9, false, false],
  ["ORD-1014", 13, "4K monitor", 540, 2, false, false],
  ["ORD-1015", 14, "Cast iron skillet", 75, 31, false, false],
  ["ORD-1016", 0, "Silk pillowcase", 42, 60, false, false],
  ["ORD-1017", 1, "Phone case", 25, 7, false, false],
  ["ORD-1018", 5, "USB-C hub", 59, 18, false, false],
  ["ORD-1019", 3, "Desk lamp", 68, 15, false, true],
];

export async function seed() {
  if ((await Customer.countDocuments()) > 0) return;
  const customers = await Customer.insertMany(
    people.map((name) => ({ name, email: `${name.split(" ")[0].toLowerCase()}@example.com` }))
  );
  await Order.insertMany(
    orders.map(([orderNumber, c, item, amount, days, finalSale, refunded]) => ({
      orderNumber, customer: customers[c]._id, item, amount, finalSale, refunded,
      purchasedAt: new Date(Date.now() - days * 86_400_000),
    }))
  );
  console.log("Seeded 15 customers and 19 orders");
}
