"use client";

import { useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, getIdToken, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { EVENT_TYPES, POINT_RULES, type EventType } from "@/lib/pointRules";
import { isEboard } from "@/lib/eboard";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Pod = { id: string; name: string; points: number };

export default function SubmitPage() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [pods, setPods] = useState<Pod[]>([]);
  const [loadingPods, setLoadingPods] = useState(true);

  const [podId, setPodId] = useState("");
  const [eventType, setEventType] = useState<EventType>("GBM");
  const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const authorized = isEboard(userEmail);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUserEmail(u?.email ?? null);
      if (!u) router.push("/login");
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    (async () => {
      setLoadingPods(true);
      try {
        const q = query(collection(db, "pods"), orderBy("points", "desc"));
        const snap = await getDocs(q);
        const list: Pod[] = snap.docs.map((d) => ({
          id: d.id,
          name: (d.data().name as string) || d.id,
          points: (d.data().points as number) || 0,
        }));
        setPods(list);
        setPodId(list[0]?.id ?? "");
      } catch (e: any) {
        setToast(`❌ Failed to load pods: ${e.message}`);
      } finally {
        setLoadingPods(false);
      }
    })();
  }, []);

  const rulesForEvent = useMemo(
    () => POINT_RULES.filter((r) => r.eventTypes.includes(eventType)),
    [eventType]
  );

  // keep selections valid when event type changes
  useEffect(() => {
    const allowed = new Set(rulesForEvent.map((r) => r.id));
    setSelectedRuleIds((prev) => prev.filter((id) => allowed.has(id)));
  }, [rulesForEvent]);

  const totalPoints = useMemo(() => {
    const map = new Map(POINT_RULES.map((r) => [r.id, r.points]));
    return selectedRuleIds.reduce((sum, id) => sum + (map.get(id) ?? 0), 0);
  }, [selectedRuleIds]);

  const selectedLabels = useMemo(() => {
    const map = new Map(POINT_RULES.map((r) => [r.id, r.label]));
    return selectedRuleIds.map((id) => map.get(id) ?? id);
  }, [selectedRuleIds]);

  async function handleSubmit() {
    if (!authorized) {
      setToast("Not authorized: you must sign in with an NSBE e-board Gmail.");
      return;
    }
    if (!podId) {
      setToast("Pick a pod.");
      return;
    }
    if (selectedRuleIds.length === 0) {
      setToast("Select at least one point action.");
      return;
    }

    const confirmText =
      `Submit ${totalPoints} pts to pod?\n\n` +
      `Event: ${eventType}\n` +
      `Actions:\n- ${selectedLabels.join("\n- ")}\n\n` +
      (reason ? `Reason: ${reason}\n\n` : "") +
      `Continue?`;

    if (!window.confirm(confirmText)) return;

    setSubmitting(true);
    setToast(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        setToast("❌ Session expired. Please sign in again.");
        router.push("/login");
        return;
      }
      const token = await getIdToken(user, true);

      const res = await fetch("/api/bonus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          podId,
          delta: totalPoints,
          eventType,
          selectedRuleIds,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");

      setToast("✅ Points submitted!");
      setSelectedRuleIds([]);
      setReason("");

      // refresh pods to show updated point totals in dropdown
      const q = query(collection(db, "pods"), orderBy("points", "desc"));
      const snap = await getDocs(q);
      setPods(
        snap.docs.map((d) => ({
          id: d.id,
          name: (d.data().name as string) || d.id,
          points: (d.data().points as number) || 0,
        }))
      );
    } catch (e: any) {
      setToast(`❌ ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignOut() {
    await signOut(auth);
    router.push("/login");
  }

  if (!userEmail) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Submit Points</h1>
            <p className="mt-2 text-white/70">
              Signed in as <span className="text-white">{userEmail}</span>
            </p>
            {!authorized && (
              <p className="mt-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200">
                You’re signed in, but you’re <b>not</b> an authorized e-board account.
              </p>
            )}
          </div>

          <button
            onClick={handleSignOut}
            className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
          >
            Sign out
          </button>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_120px_rgba(255,0,0,0.12)]">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm text-white/70">Pod</label>
              <select
                value={podId}
                onChange={(e) => setPodId(e.target.value)}
                disabled={loadingPods || !authorized}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-red-500/60"
              >
                {pods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.points} pts
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-white/70">Event type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                disabled={!authorized}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-red-500/60"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs text-white/50">
                Actions shown below are automatically limited to this event type.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-semibold">Point actions</h2>
              <div className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold">
                Total: {totalPoints} pts
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {rulesForEvent.map((r) => {
                const checked = selectedRuleIds.includes(r.id);
                return (
                  <label
                    key={r.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                      checked
                        ? "border-red-500/60 bg-red-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={!authorized}
                      onChange={() => {
                        setSelectedRuleIds((prev) =>
                          prev.includes(r.id)
                            ? prev.filter((x) => x !== r.id)
                            : [...prev, r.id]
                        );
                      }}
                      className="mt-1 h-4 w-4 accent-red-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{r.label}</div>
                      <div className="text-sm text-white/60">{r.points} pts</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <label className="text-sm text-white/70">Notes / proof (optional)</label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={!authorized}
              placeholder="e.g., screenshot link, attendee count, who checked in, etc."
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-red-500/60"
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => router.push("/leaderboard")}
              className="rounded-xl border border-white/15 px-5 py-3 text-sm hover:bg-white/10"
            >
              Back to Leaderboard
            </button>

            <button
              onClick={handleSubmit}
              disabled={!authorized || submitting || totalPoints === 0}
              className="rounded-full bg-red-600 px-8 py-3 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit points"}
            </button>
          </div>

          {toast && (
            <div className="mt-6 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm">
              {toast}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
