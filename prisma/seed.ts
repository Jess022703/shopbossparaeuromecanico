import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Euromecanico database...");

  // Safety: never wipe a database that already has data (protects production
  // on redeploys). Use `npm run db:reset` locally for a full reset.
  const existing = await prisma.client.count();
  if (existing > 0) {
    console.log(`↩️  Database already has ${existing} client(s); skipping seed.`);
    return;
  }

  // Clean existing data (idempotent seed).
  await prisma.messageLog.deleteMany();
  await prisma.lineItem.deleteMany();
  await prisma.repairOrder.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.client.deleteMany();
  await prisma.part.deleteMany();
  await prisma.repairGuide.deleteMany();

  // --- Clients ---
  const edwin = await prisma.client.create({
    data: {
      name: "Carlos Rivera",
      phone: "+1 (787) 555-0142",
      email: "carlos.rivera@example.com",
    },
  });

  const maria = await prisma.client.create({
    data: {
      name: "María Santos",
      phone: "+1 (787) 555-0199",
      email: "maria.santos@example.com",
    },
  });

  // --- Vehicles (Porsche 911, Cayenne, Boxster) ---
  const n911 = await prisma.vehicle.create({
    data: {
      vin: "WP0AB2A99KS123456",
      plate: "GT3-911",
      make: "Porsche",
      model: "911 Carrera S",
      year: 2019,
      color: "Guards Red",
      notes: "Cliente prefiere aceite Mobil 1. Llantas Michelin Pilot Sport.",
      clientId: edwin.id,
    },
  });

  const cayenne = await prisma.vehicle.create({
    data: {
      vin: "WP1AB2A52LLA98765",
      plate: "CAY-202",
      make: "Porsche",
      model: "Cayenne S",
      year: 2020,
      color: "Negro",
      clientId: edwin.id,
    },
  });

  const boxster = await prisma.vehicle.create({
    data: {
      vin: "WP0CB2A89GS112233",
      plate: "BXR-718",
      make: "Porsche",
      model: "718 Boxster",
      year: 2017,
      color: "Blanco",
      clientId: maria.id,
    },
  });

  // --- Repair Orders (5 in different statuses) ---
  const order1 = await prisma.repairOrder.create({
    data: {
      vehicleId: n911.id,
      status: "IN_REPAIR",
      description: "Cambio de embrague y revisión de transmisión PDK.",
      notes: "Embrague desgastado confirmado en diagnóstico.",
      approved: true,
      lineItems: {
        create: [
          {
            type: "LABOR",
            description: "Mano de obra: reemplazo de embrague",
            quantity: 8,
            unitPrice: 95,
          },
          {
            type: "PART",
            description: "Kit de embrague Porsche 911",
            quantity: 1,
            unitPrice: 1850,
            partNumber: "99111691X",
          },
        ],
      },
    },
  });

  const order2 = await prisma.repairOrder.create({
    data: {
      vehicleId: cayenne.id,
      status: "WAITING_PARTS",
      description: "Reemplazo de pastillas y rotores de freno delanteros.",
      notes: "Esperando rotores. Llegada estimada en 3 días.",
      approved: true,
      lineItems: {
        create: [
          {
            type: "PART",
            description: "Pastillas de freno delanteras",
            quantity: 1,
            unitPrice: 320,
            partNumber: "BRK-CAY-FRT",
          },
          {
            type: "PART",
            description: "Rotores de freno delanteros (par)",
            quantity: 2,
            unitPrice: 410,
            partNumber: "ROT-CAY-FRT",
          },
          {
            type: "LABOR",
            description: "Mano de obra: frenos delanteros",
            quantity: 2.5,
            unitPrice: 95,
          },
        ],
      },
    },
  });

  const order3 = await prisma.repairOrder.create({
    data: {
      vehicleId: boxster.id,
      status: "DIAGNOSING",
      description: "Luz de check engine encendida. Posible sensor de oxígeno.",
      notes: "Escaneando códigos OBD-II.",
    },
  });

  const order4 = await prisma.repairOrder.create({
    data: {
      vehicleId: n911.id,
      status: "READY",
      description: "Cambio de aceite y filtros, inspección general.",
      notes: "Listo para recoger. Todo en orden.",
      approved: true,
      lineItems: {
        create: [
          {
            type: "LABOR",
            description: "Mano de obra: cambio de aceite e inspección",
            quantity: 1.5,
            unitPrice: 95,
          },
          {
            type: "PART",
            description: "Aceite Mobil 1 0W-40 (8 qt)",
            quantity: 8,
            unitPrice: 14,
            partNumber: "OIL-M1-0W40",
          },
          {
            type: "PART",
            description: "Filtro de aceite Porsche",
            quantity: 1,
            unitPrice: 28,
            partNumber: "FLT-911-OIL",
          },
        ],
      },
    },
  });

  const order5 = await prisma.repairOrder.create({
    data: {
      vehicleId: boxster.id,
      status: "DELIVERED",
      description: "Alineación y balanceo de las cuatro ruedas.",
      notes: "Entregado el mes pasado. Cliente satisfecho.",
      approved: true,
      lineItems: {
        create: [
          {
            type: "LABOR",
            description: "Mano de obra: alineación 4 ruedas",
            quantity: 2,
            unitPrice: 95,
          },
        ],
      },
    },
  });

  // Seed a couple of message logs for the in-progress orders.
  await prisma.messageLog.createMany({
    data: [
      {
        orderId: order1.id,
        channel: "email-log",
        body: "Su vehículo está en proceso de reparación.",
      },
      {
        orderId: order4.id,
        channel: "email-log",
        body: "¡Su vehículo está listo para ser recogido! Puede visitarnos en horario de lunes a viernes 8am-5pm.",
      },
    ],
  });

  // --- Parts inventory (10) ---
  await prisma.part.createMany({
    data: [
      {
        partNumber: "99111691X",
        description: "Kit de embrague",
        brand: "Sachs",
        location: "A1-03",
        stock: 2,
        unitCost: 1450,
        compatibleWith: "911 (991/992)",
      },
      {
        partNumber: "BRK-CAY-FRT",
        description: "Pastillas de freno delanteras",
        brand: "Brembo",
        location: "B2-11",
        stock: 6,
        unitCost: 210,
        compatibleWith: "Cayenne",
      },
      {
        partNumber: "ROT-CAY-FRT",
        description: "Rotor de freno delantero",
        brand: "Zimmermann",
        location: "B2-12",
        stock: 0,
        unitCost: 290,
        compatibleWith: "Cayenne",
      },
      {
        partNumber: "OIL-M1-0W40",
        description: "Aceite Mobil 1 0W-40 (1 qt)",
        brand: "Mobil 1",
        location: "C1-01",
        stock: 48,
        unitCost: 9.5,
        compatibleWith: "Todos",
      },
      {
        partNumber: "FLT-911-OIL",
        description: "Filtro de aceite",
        brand: "Mahle",
        location: "C1-04",
        stock: 14,
        unitCost: 16,
        compatibleWith: "911, Boxster, Cayman",
      },
      {
        partNumber: "SPK-IRID-6",
        description: "Bujía de iridio (juego de 6)",
        brand: "NGK",
        location: "C3-08",
        stock: 9,
        unitCost: 78,
        compatibleWith: "911 Carrera",
      },
      {
        partNumber: "O2-SENS-718",
        description: "Sensor de oxígeno",
        brand: "Bosch",
        location: "D1-02",
        stock: 3,
        unitCost: 165,
        compatibleWith: "718 Boxster/Cayman",
      },
      {
        partNumber: "AIR-FLT-CAY",
        description: "Filtro de aire del motor",
        brand: "Mann",
        location: "C2-05",
        stock: 7,
        unitCost: 34,
        compatibleWith: "Cayenne",
      },
      {
        partNumber: "BAT-AGM-95",
        description: "Batería AGM 95Ah",
        brand: "Varta",
        location: "E1-01",
        stock: 4,
        unitCost: 245,
        compatibleWith: "Todos",
      },
      {
        partNumber: "WPR-911-22",
        description: "Juego de plumillas",
        brand: "Bosch",
        location: "C4-10",
        stock: 12,
        unitCost: 38,
        compatibleWith: "911",
      },
    ],
  });

  // --- Repair Guides (3) ---
  await prisma.repairGuide.create({
    data: {
      title: "Cambio de aceite y filtro — 911 Carrera",
      model: "911 Carrera",
      year: "2017-2022",
      category: "Motor",
      notes: "Usar siempre aceite aprobado Porsche A40. Capacidad ~8.5 qt.",
      steps: JSON.stringify([
        {
          title: "Calentar el motor",
          description:
            "Encienda el motor por 5 minutos para que el aceite fluya mejor al drenar.",
        },
        {
          title: "Levantar el vehículo",
          description:
            "Use los puntos de elevación designados y asegure el vehículo en soportes.",
          warning: "Nunca trabaje bajo un vehículo sostenido solo por el gato.",
        },
        {
          title: "Drenar el aceite",
          description:
            "Retire el tapón de drenaje y deje salir todo el aceite usado en un recipiente.",
        },
        {
          title: "Reemplazar el filtro",
          description: "Retire el filtro viejo e instale el nuevo con junta lubricada.",
        },
        {
          title: "Rellenar y verificar",
          description:
            "Agregue aceite nuevo, arranque el motor y verifique el nivel y posibles fugas.",
        },
      ]),
    },
  });

  await prisma.repairGuide.create({
    data: {
      title: "Reemplazo de frenos delanteros — Cayenne",
      model: "Cayenne",
      year: "2019-2023",
      category: "Frenos",
      notes: "Par de torque de los tornillos del caliper: 85 Nm.",
      steps: JSON.stringify([
        {
          title: "Aflojar tuercas de rueda",
          description: "Afloje las tuercas antes de levantar el vehículo.",
        },
        {
          title: "Retirar la rueda y el caliper",
          description: "Desmonte la rueda y suspenda el caliper sin tensar la manguera.",
          warning: "No deje el caliper colgando de la línea de freno.",
        },
        {
          title: "Cambiar pastillas y rotor",
          description: "Reemplace las pastillas desgastadas y el rotor si es necesario.",
        },
        {
          title: "Reensamblar y asentar frenos",
          description:
            "Reinstale todo, bombee el pedal y realice el procedimiento de asentado.",
        },
      ]),
    },
  });

  await prisma.repairGuide.create({
    data: {
      title: "Diagnóstico de sensor de oxígeno — 718 Boxster",
      model: "718 Boxster",
      year: "2016-2021",
      category: "Eléctrico",
      notes: "Códigos típicos: P0136, P0141.",
      steps: JSON.stringify([
        {
          title: "Leer códigos OBD-II",
          description: "Conecte el escáner y registre todos los códigos de falla.",
        },
        {
          title: "Inspeccionar conectores",
          description: "Verifique el cableado y conectores del sensor por daños o corrosión.",
        },
        {
          title: "Probar el sensor",
          description: "Mida la señal del sensor con el motor en temperatura de operación.",
          warning: "El sistema de escape estará caliente. Use guantes.",
        },
        {
          title: "Reemplazar si es necesario",
          description: "Sustituya el sensor defectuoso y borre los códigos.",
        },
      ]),
    },
  });

  console.log("✅ Seed complete.");
  console.log(`   QR tokens for tracking:`);
  for (const o of [order1, order2, order3, order4, order5]) {
    console.log(`   - ${o.status.padEnd(14)} /track/${o.qrToken}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
