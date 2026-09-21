import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { turso } from "@/app/lib/turso";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  if (cookieStore.get("cc_admin")?.value !== "authenticated") return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  const { id } = await params;
  try {
    const body = await request.json();
    const status = ["pending", "approved", "rejected"].includes(body.status) ? body.status : "pending";
    const groomPhone = String(body.groomPhone ?? "").replace(/\D/g, "");
    const bridePhone = String(body.bridePhone ?? "").replace(/\D/g, "");
    await turso.execute({
      sql: `UPDATE registrations SET groom_name = ?, bride_name = ?, groom_phone = ?, bride_phone = ?, groom_income_cents = ?, bride_income_cents = ?, city = ?, has_property = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [String(body.groomName ?? "").trim(), String(body.brideName ?? "").trim(), groomPhone, bridePhone, Math.max(0, Math.round(Number(body.groomIncomeCents) || 0)), Math.max(0, Math.round(Number(body.brideIncomeCents) || 0)), String(body.city ?? "").trim(), body.hasProperty ? 1 : 0, status, id],
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Não foi possível salvar a alteração." }, { status: 500 });
  }
}
