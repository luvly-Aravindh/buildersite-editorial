// Single place the front end talks to the PHP back end.
export const LEAD_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT || '/api/lead.php'

// Real booking link (Google Calendar / TidyCal / Calendly). Leave blank to
// fall through straight to the thank-you page, which keeps the funnel demoable.
export const BOOKING_URL = import.meta.env.VITE_BOOKING_URL || ''

export const IS_GOOGLE_BOOKING = /calendar\.google\.com/i.test(BOOKING_URL)

/** Path only — used for iframe breakout + same-origin checks. */
export const THANKYOU_PATH = `${import.meta.env.BASE_URL}thankyou`.replace(/\/{2,}/g, '/')

/** Absolute URL — passed to TidyCal as redirect_url. */
export function getThankYouUrl(name = '') {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const base = `${origin}${THANKYOU_PATH}`
  if (!name.trim()) return base
  return `${base}?name=${encodeURIComponent(name.trim())}`
}

export function buildBookingUrl(name = '', email = '') {
  if (!BOOKING_URL) return ''

  // Google Calendar appointment schedules do not support custom redirect URLs
  // or external prefill params for guest details, so we use the schedule URL as-is.
  if (IS_GOOGLE_BOOKING) return BOOKING_URL

  const sep = BOOKING_URL.includes('?') ? '&' : '?'
  return (
    `${BOOKING_URL}${sep}name=${encodeURIComponent(name.trim())}` +
    `&email=${encodeURIComponent(email.trim())}` +
    `&redirect_url=${encodeURIComponent(getThankYouUrl(name))}`
  )
}

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
