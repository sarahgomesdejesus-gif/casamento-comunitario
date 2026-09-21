import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { protocol, statusLabel, turso } from "@/app/lib/turso";

export const dynamic = "force-dynamic";

const fullName = (name: unknown) => typeof name === "string" && /^\p{L}{3,}\s+\p{L}{2,}/u.test(name.trim());
const digits = (value: unknown) => String(value ?? "").replace(/\D/g, "");
const income = (value: unknown) => Math.max(0, Math.round(Number(value) || 0));

function toRegistration(row: Record<string, unknown>) {
  return {
    id: row.id,
    protocol: row.protocol,
    groomName: row.groom_name,
    brideName: row.bride_name,
    groomPhone: row.groom_phone,
    bridePhone: row.bride_phone,
    groomIncomeCents: Number(row.groom_income_cents),
    brideIncomeCents: Number(row.bride_income_cents),
    city: row.city,
    hasProperty: Boolean(row.has_property),
    status: row.status,
    statusLabel: statusLabel(String(row.status)),
    createdAt: row.created_at,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!fullName(body.groomName) || !fullName(body.brideName)) {
      return NextResponse.json({ message: "Informe nome e sobrenome; o primeiro nome precisa ter ao menos 3 letras." }, { status: 400 });
    }
    const groomPhone = digits(body.groomPhone);
    const bridePhone = digits(body.bridePhone);
    if (groomPhone.length < 10 || bridePhone.length < 10) return NextResponse.json({ message: "Informe os dois telefones com DDD." }, { status: 400 });
    if (!body.lgpd || !body.truth || !body.hipossuficiencia) return NextResponse.json({ message: "É necessário aceitar todas as declarações." }, { status: 400 });

    const id = crypto.randomUUID();
    const code = protocol();
    await turso.execute({
      sql: `INSERT INTO registrations (id, protocol, groom_name, bride_name, groom_phone, bride_phone, groom_income_cents, bride_income_cents, city, has_property, lgpd_accepted, truth_accepted, hardship_accepted, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [id, code, body.groomName.trim(), body.brideName.trim(), groomPhone, bridePhone, income(body.groomIncomeCents), income(body.brideIncomeCents), String(body.city ?? "").trim(), body.hasProperty === "sim" ? 1 : 0, 1, 1, 1],
    });
    return NextResponse.json({ protocol: code }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Não foi possível registrar agora. Tente novamente." }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get("cc_admin")?.value !== "authenticated") return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  try {
    const result = await turso.execute("SELECT * FROM registrations ORDER BY created_at DESC");
    const registrations = result.rows.map((row) => toRegistration(row as unknown as Record<string, unknown>));
    return NextResponse.json({ registrations });
  } catch {
    return NextResponse.json({ message: "Não foi possível carregar os cadastros." }, { status: 500 });
  }
}
