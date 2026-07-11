import { promises as fs } from "node:fs";
import path from "node:path";
import { initialData } from "./seed-data";
import type { Appointment, Contact, ContactGroup, Customer, EuroShopData, InventoryItem, RepairOrder, Vehicle } from "./types";

const dataPath = path.join(process.cwd(), "data", "euroshop.json");

async function ensureDataFile() {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });

  try {
    await fs.access(dataPath);
  } catch {
    await fs.writeFile(dataPath, JSON.stringify(initialData, null, 2));
  }
}

export async function readData(): Promise<EuroShopData> {
  await ensureDataFile();
  const raw = await fs.readFile(dataPath, "utf8");
  return JSON.parse(raw) as EuroShopData;
}

export async function writeData(data: EuroShopData) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function cents(value: unknown) {
  return Math.round(Number(value || 0) * 100);
}

export async function getDashboardData() {
  const data = await readData();
  const activeStatuses = ["PENDING", "APPROVED", "IN_PROGRESS", "WAITING_PARTS", "QUALITY_CHECK", "READY"];
  const activeOrders = data.repairOrders.filter((order) => activeStatuses.includes(order.status));
  const inventoryValue = data.inventory.reduce((sum, item) => sum + item.quantity * item.unitCostCents, 0);
  const dateInShopTimezone = (value: Date | string) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Puerto_Rico",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date(value));
  const today = dateInShopTimezone(new Date());
  const appointmentsToday = data.appointments.filter(
    (appointment) => dateInShopTimezone(appointment.scheduledAt) === today
  );

  return {
    ...data,
    metrics: {
      revenueCents: activeOrders.reduce((sum, order) => sum + order.totalCents, 0),
      activeOrders: activeOrders.length,
      highPriority: activeOrders.filter((order) => order.priority === "HIGH").length,
      appointmentsToday: appointmentsToday.length,
      confirmedAppointments: appointmentsToday.filter((appointment) => appointment.status === "CONFIRMED").length,
      inventoryValueCents: inventoryValue,
      inventoryItems: data.inventory.length
    }
  };
}

export async function createCustomer(input: Omit<Customer, "id" | "createdAt">) {
  const data = await readData();
  const customer: Customer = { id: id("cus"), createdAt: new Date().toISOString(), ...input };
  data.customers.unshift(customer);
  data.activities.unshift({ id: id("act"), label: `Cliente creado: ${customer.name}`, createdAt: new Date().toISOString() });
  await writeData(data);
  return customer;
}

export async function createVehicle(input: Omit<Vehicle, "id" | "createdAt" | "mileage"> & { mileage?: number }) {
  const data = await readData();
  const vehicle: Vehicle = { id: id("veh"), mileage: Number(input.mileage || 0), createdAt: new Date().toISOString(), ...input };
  data.vehicles.unshift(vehicle);
  data.activities.unshift({ id: id("act"), label: `Vehiculo creado: ${vehicle.year} ${vehicle.make} ${vehicle.model}`, createdAt: new Date().toISOString() });
  await writeData(data);
  return vehicle;
}

export async function createRepairOrder(input: {
  customerId: string;
  vehicleId: string;
  complaint: string;
  priority: RepairOrder["priority"];
  labor: number;
  parts: number;
}) {
  const data = await readData();
  const year = new Date().getFullYear();
  const last = data.repairOrders
    .map((order) => Number(order.roNumber.split("-").at(-1)))
    .filter(Boolean)
    .sort((a, b) => b - a)[0] ?? 1021;
  const laborCents = cents(input.labor);
  const partsCents = cents(input.parts);
  const taxCents = Math.round((laborCents + partsCents) * data.shop.taxRate);
  const totalCents = laborCents + partsCents + taxCents;
  const now = new Date().toISOString();
  const order: RepairOrder = {
    id: id("ro"),
    roNumber: `RO-${year}-${String(last + 1).padStart(4, "0")}`,
    customerId: input.customerId,
    vehicleId: input.vehicleId,
    complaint: input.complaint,
    status: "PENDING",
    priority: input.priority,
    laborCents,
    partsCents,
    taxCents,
    totalCents,
    portalToken: id("portal"),
    approved: false,
    paid: false,
    createdAt: now,
    updatedAt: now
  };

  data.repairOrders.unshift(order);
  data.activities.unshift({ id: id("act"), label: `Nueva orden ${order.roNumber}`, createdAt: now });
  await writeData(data);
  return order;
}

export async function updateRepairOrderStatus(idOrRoNumber: string, status: RepairOrder["status"]) {
  const data = await readData();
  const order = data.repairOrders.find((item) => item.id === idOrRoNumber || item.roNumber === idOrRoNumber);
  if (!order) return null;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  data.activities.unshift({ id: id("act"), label: `${order.roNumber} cambio a ${status}`, createdAt: order.updatedAt });
  await writeData(data);
  return order;
}

export async function approveRepairOrder(token: string) {
  const data = await readData();
  const order = data.repairOrders.find((item) => item.portalToken === token);
  if (!order) return null;

  const now = new Date().toISOString();
  order.approved = true;
  if (order.status === "PENDING") order.status = "APPROVED";
  order.updatedAt = now;
  data.activities.unshift({ id: id("act"), label: `${order.roNumber} aprobado por el cliente`, createdAt: now });
  await writeData(data);
  return order;
}

export async function createAppointment(input: Omit<Appointment, "id">) {
  const data = await readData();
  const appointment: Appointment = { id: id("appt"), ...input };
  data.appointments.unshift(appointment);
  data.activities.unshift({ id: id("act"), label: `Nueva cita: ${appointment.vehicleInfo}`, createdAt: new Date().toISOString() });
  await writeData(data);
  return appointment;
}

export async function createInventoryItem(input: Omit<InventoryItem, "id" | "unitCostCents" | "unitPriceCents"> & { unitCost: number; unitPrice: number }) {
  const data = await readData();
  const item: InventoryItem = {
    id: id("inv"),
    partNumber: input.partNumber,
    description: input.description,
    brand: input.brand,
    quantity: Number(input.quantity || 0),
    minQuantity: Number(input.minQuantity || 0),
    unitCostCents: cents(input.unitCost),
    unitPriceCents: cents(input.unitPrice),
    location: input.location
  };
  data.inventory.unshift(item);
  data.activities.unshift({ id: id("act"), label: `Inventario agregado: ${item.partNumber}`, createdAt: new Date().toISOString() });
  await writeData(data);
  return item;
}

export async function listContactGroups(): Promise<ContactGroup[]> {
  const data = await readData();
  return data.contactGroups ?? [];
}

export async function getContactGroup(groupId: string): Promise<ContactGroup | null> {
  const data = await readData();
  return (data.contactGroups ?? []).find((group) => group.id === groupId) ?? null;
}

export async function createContactGroup(name: string, contacts: Contact[]): Promise<ContactGroup> {
  const data = await readData();
  if (!data.contactGroups) data.contactGroups = [];
  const group: ContactGroup = {
    id: id("grp"),
    name: name.trim() || `Grupo ${new Date().toLocaleDateString("es-PR")}`,
    createdAt: new Date().toISOString(),
    contacts
  };
  data.contactGroups.unshift(group);
  data.activities.unshift({
    id: id("act"),
    label: `Grupo de contactos creado: ${group.name} (${contacts.length})`,
    createdAt: group.createdAt
  });
  await writeData(data);
  return group;
}

export async function updateContactGroupMessage(groupId: string, subject: string, body: string): Promise<ContactGroup | null> {
  const data = await readData();
  const group = (data.contactGroups ?? []).find((item) => item.id === groupId);
  if (!group) return null;
  group.subject = subject;
  group.body = body;
  await writeData(data);
  return group;
}

export async function markContactsSent(groupId: string, emails: string[]): Promise<void> {
  const data = await readData();
  const group = (data.contactGroups ?? []).find((item) => item.id === groupId);
  if (!group) return;
  const sentSet = new Set(emails.map((email) => email.trim().toLowerCase()));
  const now = new Date().toISOString();
  for (const contact of group.contacts) {
    if (sentSet.has(contact.email.trim().toLowerCase())) {
      contact.sentAt = now;
    }
  }
  await writeData(data);
}

/** Reinicia el estado de envio de todos los contactos del grupo (los vuelve "pendientes"). */
export async function resetContactsSent(groupId: string): Promise<void> {
  const data = await readData();
  const group = (data.contactGroups ?? []).find((item) => item.id === groupId);
  if (!group) return;
  for (const contact of group.contacts) {
    delete contact.sentAt;
  }
  await writeData(data);
}

export async function deleteContactGroup(groupId: string): Promise<void> {
  const data = await readData();
  if (!data.contactGroups) return;
  data.contactGroups = data.contactGroups.filter((group) => group.id !== groupId);
  await writeData(data);
}

export async function getPortalData(token: string) {
  const data = await readData();
  const order = data.repairOrders.find((item) => item.portalToken === token);
  if (!order) return null;

  return {
    shop: data.shop,
    order,
    customer: data.customers.find((item) => item.id === order.customerId),
    vehicle: data.vehicles.find((item) => item.id === order.vehicleId),
    invoice: data.invoices.find((item) => item.repairOrderId === order.id)
  };
}
