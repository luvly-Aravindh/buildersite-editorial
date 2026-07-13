// Single place the front end talks to the PHP back end.
export const LEAD_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT || '/api/lead.php'

// Real booking link (TidyCal / Calendly). Leave blank to fall through
// straight to the thank-you page, which keeps the funnel demoable.
export const BOOKING_URL = import.meta.env.VITE_BOOKING_URL || ''

export async function submitLead(payload) {
  const res = await fetch(LEAD_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  let data = null
  try { data = await res.json() } catch { /* non-JSON error page */ }
  if (!res.ok || !data?.ok) {
    const msg = data?.error || `Request failed (${res.status})`
    throw new Error(msg)
  }
  return data
}
