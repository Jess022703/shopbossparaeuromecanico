import type { EuroShopData } from "./types";

const now = new Date("2026-06-11T17:30:00-04:00");

function iso(hoursAgo = 0) {
  return new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString();
}

export const initialData: EuroShopData = {
  shop: {
    id: "shop_euromecanico",
    name: "Euromecanico Corp",
    city: "Sabana Seca, PR",
    taxRate: 0.115,
    laborRateCents: 14500
  },
  customers: [
    { id: "cus_jorge", name: "Jorge Rivera", phone: "787-555-0101", email: "jorge@example.com", address: "Toa Baja, PR", createdAt: iso(180) },
    { id: "cus_carlos", name: "Carlos Morales", phone: "787-555-0102", email: "carlos@example.com", address: "Bayamon, PR", createdAt: iso(150) },
    { id: "cus_ricardo", name: "Ricardo Perez", phone: "787-555-0103", email: "ricardo@example.com", address: "Dorado, PR", createdAt: iso(120) },
    { id: "cus_andres", name: "Andres Vega", phone: "787-555-0104", email: "andres@example.com", address: "Guaynabo, PR", createdAt: iso(90) },
    { id: "cus_manuel", name: "Manuel Arroyo", phone: "787-555-0105", email: "manuel@example.com", address: "San Juan, PR", createdAt: iso(60) }
  ],
  vehicles: [
    { id: "veh_911_turbo", customerId: "cus_jorge", vin: "WP0AD2A99JS156781", year: 2018, make: "Porsche", model: "911 Turbo S", generation: "991.2", mileage: 32850, plate: "POR-911", createdAt: iso(160) },
    { id: "veh_cayenne", customerId: "cus_carlos", vin: "WP1AB2AY6LDA30571", year: 2020, make: "Porsche", model: "Cayenne GTS", generation: "E3", mileage: 44520, plate: "CAY-202", createdAt: iso(130) },
    { id: "veh_carrera", customerId: "cus_ricardo", vin: "WP0AB2A91HS123456", year: 2017, make: "Porsche", model: "911 Carrera S", generation: "991.2", mileage: 39110, plate: "991-RP", createdAt: iso(100) },
    { id: "veh_panamera", customerId: "cus_andres", vin: "WP0AA2A75KL123987", year: 2019, make: "Porsche", model: "Panamera 4S", generation: "971", mileage: 28200, plate: "PAN-4S", createdAt: iso(70) },
    { id: "veh_boxster", customerId: "cus_manuel", vin: "WP0CB2A88GS140019", year: 2016, make: "Porsche", model: "Boxster GTS", generation: "981", mileage: 50125, plate: "BOX-GT", createdAt: iso(48) }
  ],
  repairOrders: [
    { id: "ro_1021", roNumber: "RO-2026-1021", customerId: "cus_jorge", vehicleId: "veh_911_turbo", complaint: "Oil change service, boost leak inspection and PIWIS scan.", status: "IN_PROGRESS", priority: "HIGH", laborCents: 185000, partsCents: 250000, taxCents: 50025, totalCents: 485025, portalToken: "demo-token", approved: true, paid: false, createdAt: iso(5), updatedAt: iso(0.04) },
    { id: "ro_1020", roNumber: "RO-2026-1020", customerId: "cus_carlos", vehicleId: "veh_cayenne", complaint: "Brake inspection and front pad estimate.", status: "WAITING_PARTS", priority: "MEDIUM", laborCents: 72000, partsCents: 121000, taxCents: 22195, totalCents: 215195, portalToken: "portal-cayenne", approved: true, paid: false, createdAt: iso(18), updatedAt: iso(0.25) },
    { id: "ro_1019", roNumber: "RO-2026-1019", customerId: "cus_ricardo", vehicleId: "veh_carrera", complaint: "Annual service, spark plugs and bore scope risk check.", status: "QUALITY_CHECK", priority: "HIGH", laborCents: 135000, partsCents: 156000, taxCents: 33465, totalCents: 324465, portalToken: "portal-carrera", approved: false, paid: false, createdAt: iso(24), updatedAt: iso(3) },
    { id: "ro_1018", roNumber: "RO-2026-1018", customerId: "cus_andres", vehicleId: "veh_panamera", complaint: "AC service and cabin filter.", status: "IN_PROGRESS", priority: "MEDIUM", laborCents: 87000, partsCents: 90500, taxCents: 20412, totalCents: 197912, portalToken: "portal-panamera", approved: true, paid: false, createdAt: iso(36), updatedAt: iso(5) },
    { id: "ro_1017", roNumber: "RO-2026-1017", customerId: "cus_manuel", vehicleId: "veh_boxster", complaint: "Suspension noise inspection.", status: "IN_PROGRESS", priority: "LOW", laborCents: 78000, partsCents: 70000, taxCents: 17020, totalCents: 165020, portalToken: "portal-boxster", approved: true, paid: false, createdAt: iso(48), updatedAt: iso(7) }
  ],
  appointments: [
    { id: "appt_1", customerId: "cus_jorge", customerName: "Jose A.", vehicleInfo: "2019 911 Carrera", serviceType: "Servicio de aceite", scheduledAt: "2026-06-11T08:00:00-04:00", status: "CONFIRMED" },
    { id: "appt_2", customerId: "cus_carlos", customerName: "Luis M.", vehicleInfo: "2021 Cayenne Turbo", serviceType: "Inspeccion de frenos", scheduledAt: "2026-06-11T10:00:00-04:00", status: "CONFIRMED" },
    { id: "appt_3", customerId: "cus_ricardo", customerName: "Ricardo P.", vehicleInfo: "2018 Panamera 4S", serviceType: "Servicio AC", scheduledAt: "2026-06-11T12:00:00-04:00", status: "CONFIRMED" },
    { id: "appt_4", customerId: "cus_andres", customerName: "Andres V.", vehicleInfo: "2020 Macan S", serviceType: "Diagnostico PIWIS", scheduledAt: "2026-06-11T14:00:00-04:00", status: "PENDING" },
    { id: "appt_5", customerId: "cus_manuel", customerName: "Manuel A.", vehicleInfo: "2017 911 GT3", serviceType: "Revision suspension", scheduledAt: "2026-06-11T16:00:00-04:00", status: "PENDING" }
  ],
  inventory: [
    { id: "inv_filter_997", partNumber: "997.107.521.50", description: "Oil filter 911 997", brand: "Porsche Genuine", quantity: 12, minQuantity: 4, unitCostCents: 1850, unitPriceCents: 3295, location: "A1" },
    { id: "inv_oil", partNumber: "M1-0W40", description: "Mobil 1 FS 0W-40 liter", brand: "Mobil 1", quantity: 52, minQuantity: 20, unitCostCents: 1125, unitPriceCents: 1895, location: "OIL" },
    { id: "inv_plug", partNumber: "PFR6Q", description: "NGK spark plug flat-6", brand: "NGK", quantity: 24, minQuantity: 12, unitCostCents: 1025, unitPriceCents: 1895, location: "B3" },
    { id: "inv_brake", partNumber: "DOT4-LV", description: "DOT 4 LV brake fluid", brand: "Pentosin", quantity: 18, minQuantity: 6, unitCostCents: 1400, unitPriceCents: 2495, location: "FLUID" }
  ],
  invoices: [
    { id: "inv_1015", invoiceNumber: "INV-2026-1015", repairOrderId: "ro_1021", status: "SENT", totalCents: 485025, dueDate: "2026-06-18T17:00:00-04:00" }
  ],
  activities: [
    { id: "act_1", label: "RO-2026-1021 cambio a En proceso", createdAt: iso(0.04) },
    { id: "act_2", label: "Nueva cita para 2021 Cayenne Turbo", createdAt: iso(0.25) },
    { id: "act_3", label: "Factura INV-2026-1015 enviada a Jorge R.", createdAt: iso(1) },
    { id: "act_4", label: "Orden de partes PO-2026-1008 recibida", createdAt: iso(2) },
    { id: "act_5", label: "RO-2026-1019 paso a DVI", createdAt: iso(3) }
  ],
  contactGroups: []
};
