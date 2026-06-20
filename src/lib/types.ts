export type ROStatus =
  | "PENDING"
  | "APPROVED"
  | "IN_PROGRESS"
  | "WAITING_PARTS"
  | "QUALITY_CHECK"
  | "READY"
  | "COMPLETED"
  | "INVOICED"
  | "PAID";

export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
  createdAt: string;
};

export type Vehicle = {
  id: string;
  customerId: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  generation?: string;
  mileage: number;
  plate?: string;
  createdAt: string;
};

export type RepairOrder = {
  id: string;
  roNumber: string;
  customerId: string;
  vehicleId: string;
  complaint: string;
  status: ROStatus;
  priority: Priority;
  laborCents: number;
  partsCents: number;
  taxCents: number;
  totalCents: number;
  portalToken: string;
  approved: boolean;
  paid: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Appointment = {
  id: string;
  customerId?: string;
  customerName: string;
  vehicleInfo: string;
  serviceType: string;
  scheduledAt: string;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
};

export type InventoryItem = {
  id: string;
  partNumber: string;
  description: string;
  brand: string;
  quantity: number;
  minQuantity: number;
  unitCostCents: number;
  unitPriceCents: number;
  location: string;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  repairOrderId: string;
  status: "DRAFT" | "SENT" | "PAID" | "VOID";
  totalCents: number;
  dueDate: string;
  paidAt?: string;
};

export type Activity = {
  id: string;
  label: string;
  createdAt: string;
};

export type Contact = {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  sentAt?: string;
};

export type ContactGroup = {
  id: string;
  name: string;
  createdAt: string;
  subject?: string;
  body?: string;
  contacts: Contact[];
};

export type EuroShopData = {
  shop: {
    id: string;
    name: string;
    city: string;
    taxRate: number;
    laborRateCents: number;
  };
  customers: Customer[];
  vehicles: Vehicle[];
  repairOrders: RepairOrder[];
  appointments: Appointment[];
  inventory: InventoryItem[];
  invoices: Invoice[];
  activities: Activity[];
  contactGroups?: ContactGroup[];
};
