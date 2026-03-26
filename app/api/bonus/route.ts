import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getAdminDb, verifyIdToken } from "@/lib/firebaseAdmin";
import { isEboard } from "@/lib/eboard";
import { EVENT_TYPES } from "@/lib/pointRules";

type Body = {
  podId: string;            // Firestore doc id in "pods"
  delta: number;            // total points (+ or -)
  eventType: string;        // AEX/GBM/PCI/TORCH/CONFERENCE
  selectedRuleIds: string[]; // which checkboxes were chosen
  reason?: string;          // optional text
};

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    const decoded = await verifyIdToken(token);
    const email = decoded.email?.toLowerCase();

    if (!isEboard(email)) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = (await req.json()) as Body;

    if (!body.podId || typeof body.podId !== "string") {
      return NextResponse.json({ error: "Missing podId" }, { status: 400 });
    }
    if (!Number.isInteger(body.delta) || body.delta === 0) {
      return NextResponse.json({ error: "delta must be a non-zero integer" }, { status: 400 });
    }
    if (!EVENT_TYPES.includes(body.eventType as any)) {
      return NextResponse.json({ error: "Invalid eventType" }, { status: 400 });
    }
    if (!Array.isArray(body.selectedRuleIds)) {
      return NextResponse.json({ error: "selectedRuleIds must be an array" }, { status: 400 });
    }

    const db = getAdminDb();
    const podRef = db.collection("pods").doc(body.podId);
    const logRef = db.collection("bonus_submissions").doc();

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(podRef);
      if (!snap.exists) throw new Error("Pod not found");

      tx.update(podRef, {
        points: admin.firestore.FieldValue.increment(body.delta),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      tx.set(logRef, {
        podId: body.podId,
        delta: body.delta,
        eventType: body.eventType,
        selectedRuleIds: body.selectedRuleIds,
        reason: body.reason || "",
        createdBy: email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
