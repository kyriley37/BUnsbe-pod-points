// scripts/seedPods.js
require("dotenv").config({ path: ".env.local" });

const path = require("path");
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const serviceAccountPath = path.join(process.cwd(), "secrets", "serviceAccount.json");

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  if (!getApps().length) {
    // Uses the JSON file you moved to /secrets
    const serviceAccount = require(serviceAccountPath);
    initializeApp({ credential: cert(serviceAccount) });
  }

  const db = getFirestore();

  // ✅ Your pods + starting points (from your screenshot)
  const pods = [
    { name: "67", points: 10 },
    { name: "The Silver Lining", points: 20 },
    { name: "The Mandem", points: 35 },
    { name: "Chromakopia", points: 40 },
    { name: "STEM Trooper", points: 45 },
    { name: "BMECS", points: 115 },
    { name: "The StackOverflorws", points: 170 },
    { name: "Mission A-Possible", points: 135 },
    { name: "Veneer Techs", points: 170 },
    { name: "The Breadwinners", points: 145 },
    { name: "Megaminds", points: 155 },
    { name: "Super Pod", points: 230 },
  ];

  const batch = db.batch();
  const col = db.collection("pods");

  for (const pod of pods) {
    const id = slugify(pod.name);
    const ref = col.doc(id);

    batch.set(
      ref,
      {
        name: pod.name,
        points: pod.points,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }

  await batch.commit();
  console.log(`✅ Seeded ${pods.length} pods into Firestore collection: "pods"`);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
