import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { IVU_RATE } from "./constants";
import { computeTotals, formatCurrency } from "./calc";
import { SHOP } from "./shop";

interface LineItem {
  type: string;
  description: string;
  quantity: number;
  unitPrice: number;
  partNumber: string | null;
}

interface EstimateOrder {
  id: string;
  description: string;
  notes: string | null;
  approved: boolean;
  createdAt: Date;
  vehicle: {
    vin: string;
    plate: string | null;
    make: string;
    model: string;
    year: number;
    color: string | null;
    client: { name: string; phone: string; email: string | null };
  };
  lineItems: LineItem[];
}

const GUARDS = "#CC2229";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1a1a1a" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: GUARDS,
    paddingBottom: 10,
    marginBottom: 16,
  },
  shopName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: GUARDS },
  muted: { color: "#666", fontSize: 9 },
  title: { fontSize: 14, fontFamily: "Helvetica-Bold", textAlign: "right" },
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  row: { flexDirection: "row" },
  col: { flex: 1 },
  table: { marginTop: 4, borderTopWidth: 1, borderTopColor: "#ddd" },
  th: {
    flexDirection: "row",
    backgroundColor: "#f4f2ef",
    paddingVertical: 4,
    paddingHorizontal: 4,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  tr: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cDesc: { flex: 4 },
  cQty: { flex: 1, textAlign: "right" },
  cPrice: { flex: 1.4, textAlign: "right" },
  cSub: { flex: 1.4, textAlign: "right" },
  totals: { marginTop: 12, marginLeft: "auto", width: "45%" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 4,
    marginTop: 4,
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#999",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  badge: {
    alignSelf: "flex-end",
    marginTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
});

export async function renderEstimatePdf(order: EstimateOrder): Promise<Buffer> {
  const totals = computeTotals(order.lineItems);
  const v = order.vehicle;
  const date = new Intl.DateTimeFormat("es-PR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const doc = (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.shopName}>{SHOP.name}</Text>
            <Text style={styles.muted}>{SHOP.tagline}</Text>
            <Text style={styles.muted}>{SHOP.address}</Text>
            <Text style={styles.muted}>
              {SHOP.phone} · {SHOP.email}
            </Text>
          </View>
          <View>
            <Text style={styles.title}>ESTIMADO</Text>
            <Text style={[styles.muted, { textAlign: "right" }]}>{date}</Text>
            <Text style={[styles.muted, { textAlign: "right" }]}>
              No. {order.id.slice(-8).toUpperCase()}
            </Text>
            <Text
              style={[
                styles.badge,
                order.approved
                  ? { backgroundColor: "#dcfce7", color: "#15803d" }
                  : { backgroundColor: "#f4f2ef", color: "#888" },
              ]}
            >
              {order.approved ? "APROBADO" : "PENDIENTE"}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.col, styles.section]}>
            <Text style={styles.sectionTitle}>Cliente</Text>
            <Text>{v.client.name}</Text>
            <Text style={styles.muted}>{v.client.phone}</Text>
            {v.client.email ? (
              <Text style={styles.muted}>{v.client.email}</Text>
            ) : null}
          </View>
          <View style={[styles.col, styles.section]}>
            <Text style={styles.sectionTitle}>Vehículo</Text>
            <Text>
              {v.make} {v.model} {v.year}
            </Text>
            <Text style={styles.muted}>VIN: {v.vin}</Text>
            <Text style={styles.muted}>
              Placa: {v.plate ?? "—"} · {v.color ?? "—"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trabajo</Text>
          <Text>{order.description}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.th}>
            <Text style={styles.cDesc}>Descripción</Text>
            <Text style={styles.cQty}>Cant.</Text>
            <Text style={styles.cPrice}>Precio</Text>
            <Text style={styles.cSub}>Subtotal</Text>
          </View>
          {order.lineItems.map((it, i) => (
            <View style={styles.tr} key={i}>
              <Text style={styles.cDesc}>
                [{it.type === "LABOR" ? "MANO" : "PIEZA"}] {it.description}
                {it.partNumber ? ` (${it.partNumber})` : ""}
              </Text>
              <Text style={styles.cQty}>{it.quantity}</Text>
              <Text style={styles.cPrice}>{formatCurrency(it.unitPrice)}</Text>
              <Text style={styles.cSub}>
                {formatCurrency(it.quantity * it.unitPrice)}
              </Text>
            </View>
          ))}
          {order.lineItems.length === 0 ? (
            <View style={styles.tr}>
              <Text style={styles.muted}>Sin partidas.</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>{formatCurrency(totals.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>IVU ({(IVU_RATE * 100).toFixed(1)}%)</Text>
            <Text>{formatCurrency(totals.tax)}</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text>TOTAL</Text>
            <Text>{formatCurrency(totals.total)}</Text>
          </View>
        </View>

        {order.notes ? (
          <View style={[styles.section, { marginTop: 18 }]}>
            <Text style={styles.sectionTitle}>Notas</Text>
            <Text style={styles.muted}>{order.notes}</Text>
          </View>
        ) : null}

        <Text style={styles.footer}>
          {SHOP.name} · {SHOP.phone} · {SHOP.website} · Horario:{" "}
          {SHOP.hours}
        </Text>
      </Page>
    </Document>
  );

  return renderToBuffer(doc);
}
