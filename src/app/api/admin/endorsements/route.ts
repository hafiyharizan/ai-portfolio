import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseAdminClient, getAdminEmails } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  if (!supabase || !admin) {
    return { error: "Supabase admin is not configured.", status: 503 as const };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email?.toLowerCase();
  const adminEmails = getAdminEmails();

  if (!email || !adminEmails.includes(email)) {
    return { error: "Not authorized.", status: 403 as const };
  }

  return { admin };
}

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { data, error } = await auth.admin
    .from("endorsements")
    .select("*")
    .order("status", { ascending: true })
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Could not load endorsements." }, { status: 500 });
  }

  return NextResponse.json({ endorsements: data ?? [] });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const action = typeof body?.action === "string" ? body.action : "";

  const updates: Record<string, boolean | string> =
    action === "approve"
      ? { approved: true, status: "approved" }
      : action === "reject"
        ? { approved: false, featured: false, status: "rejected" }
        : action === "feature"
          ? { approved: true, featured: true, status: "approved" }
          : action === "unfeature"
            ? { featured: false }
            : {};

  if (!id || !Object.keys(updates).length) {
    return NextResponse.json({ error: "Invalid moderation action." }, { status: 400 });
  }

  const { error } = await auth.admin
    .from("endorsements")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Could not update endorsement." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing endorsement id." }, { status: 400 });
  }

  const { error } = await auth.admin.from("endorsements").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Could not delete endorsement." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
