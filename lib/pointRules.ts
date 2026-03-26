export type EventType = "AEX" | "GBM" | "PCI" | "TORCH" | "CONFERENCE";

export type PointRule = {
  id: string;
  label: string;
  points: number;
  eventTypes: EventType[]; // which event types this applies to
};

// Based on your Google Form checklists :contentReference[oaicite:1]{index=1}
export const POINT_RULES: PointRule[] = [
  // 5 pts
  {
    id: "academic_support",
    label: "Academic support (Resume Bank, Slack engagement for Academic Help)",
    points: 5,
    eventTypes: ["AEX"],
  },
  {
    id: "early_arrival",
    label: "Early Arrival (at least 3 members 15 min or more)",
    points: 5,
    eventTypes: ["AEX", "GBM", "PCI", "TORCH"],
  },

  // 10 pts
  {
    id: "check_in",
    label: "Check-In at NSBE event (5–10 min)",
    points: 10,
    eventTypes: ["AEX", "GBM", "PCI", "TORCH", "CONFERENCE"],
  },
  {
    id: "two_thirds_attendance",
    label: "2/3rd of pod in attendance",
    points: 10,
    eventTypes: ["AEX", "GBM"],
  },
  {
    id: "half_attendance",
    label: "1/2 of pod in attendance",
    points: 10,
    eventTypes: ["PCI", "TORCH"],
  },
  {
    id: "bring_new_member",
    label: "Bring a new member to an event",
    points: 10,
    eventTypes: ["AEX", "GBM", "PCI", "TORCH"],
  },

  // 15 pts
  {
    id: "post_pod_photo",
    label: "Post family pod photo at event (tag NSBE)",
    points: 15,
    eventTypes: ["AEX", "GBM", "PCI", "TORCH", "CONFERENCE"],
  },
  {
    id: "group_reel",
    label: "Submit group TikTok/IG Reel (must be approved)",
    points: 15,
    eventTypes: ["AEX", "GBM", "PCI", "TORCH", "CONFERENCE"],
  },
  {
    id: "secure_interview",
    label: "Secure an interview",
    points: 15,
    eventTypes: ["CONFERENCE"],
  },
  {
    id: "hospitality_suite",
    label: "Attend a Hospitality Suite",
    points: 15,
    eventTypes: ["CONFERENCE"],
  },

  // 30 pts
  {
    id: "pod_challenge_win",
    label: "Win a pod challenge",
    points: 30,
    eventTypes: ["AEX", "GBM"],
  },
  {
    id: "hang_out_outside",
    label: "Hang out with family pod outside of NSBE event (½ pod in attendance)",
    points: 30,
    eventTypes: ["AEX", "GBM", "PCI", "TORCH", "CONFERENCE"],
  },
  {
    id: "nsbe_competition",
    label: "Participate in NSBE competition",
    points: 30,
    eventTypes: ["CONFERENCE"],
  },
  {
    id: "internship_job",
    label: "Internship/Job Secured (limit 1 per pod per conference)",
    points: 30,
    eventTypes: ["CONFERENCE"],
  },
  {
    id: "story_takeover",
    label: "Story Takeover (non-eboard member)",
    points: 30,
    eventTypes: ["CONFERENCE"],
  },
];

export const EVENT_TYPES: EventType[] = ["AEX", "GBM", "PCI", "TORCH", "CONFERENCE"];
