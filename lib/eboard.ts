export const EBOARD_EMAILS = new Set([
  "bu.nsbe.president@gmail.com",
  "bu.nsbe.vp.external@gmail.com",
  "bu.nsbe.vp@gmail.com",
  "bu.nsbe.treasurer@gmail.com",
  "bu.nsbe.secretary@gmail.com",
  "bu.nsbe.programschair@gmail.com",
  "bu.nsbe.aex@gmail.com",
  "bu.nsbe.torchchair@gmail.com",
  "bu.nsbe.pcichair@gmail.com",
  "bu.nsbe.senator@gmail.com",
  "bu.nsbe.senator2@gmail.com",
  "bu.nsbe.pubr@gmail.com",
]);

export function isEboard(email?: string | null) {
  if (!email) return false;
  return EBOARD_EMAILS.has(email.toLowerCase());
}
