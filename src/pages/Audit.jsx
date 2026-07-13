import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBand, Nav, Footer } from '../components/Chrome.jsx'
import { submitLead, BOOKING_URL, THANKYOU_PATH, getThankYouUrl } from '../lib/api.js'

const CITIES = ['Melbourne', 'Sydney', 'Brisbane', 'Adelaide', 'Canberra', 'Gold Coast', 'Perth', 'Other']

const QUESTIONS = [
  { id: 'licensed', label: 'Are you a licensed builder?', options: ['Yes, licensed', 'Working toward my licence', 'Prefer not to say'] },
  { id: 'volume', label: 'How many custom homes do you build a year?', options: ['1 to 3', '4 to 10', '11 to 25', '26 or more'] },
  { id: 'website', label: 'Do you have a website now?', options: ['No website yet', 'Yes, but it is dated', 'Yes, and it is fine'] },
  { id: 'findYou', label: 'How do most homeowners find you today?', options: ['Word of mouth and referrals', 'Directories like hipages', 'Google search', 'Social media', 'A mix of these'] },
  { id: 'timeline', label: 'When would you want your new site live?', options: ['As soon as possible', 'Within a month', 'In the next 3 months', 'Just exploring for now'] }
]

const Tick = () => (
  <svg viewBox="0 0 24 24">
    <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
  </svg>
)

function goToThankYou(name = '') {
  const qs = name.trim() ? `?name=${encodeURIComponent(name.trim())}` : ''
  window.location.assign(`${THANKYOU_PATH}${qs}`)
}

export default function Audit() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1 | 2 | 'calendar'
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [calSrc, setCalSrc] = useState('')
  const [f, setF] = useState({
    name: '', business: '', email: '', phone: '', city: '',
    licensed: '', volume: '', website: '', findYou: '', timeline: ''
  })
  const [trap, setTrap] = useState('')
  const frameRef = useRef(null)
  const leftForThankYou = useRef(false)

  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value }))
  const firstName = f.name.trim().split(' ')[0]

  useEffect(() => {
    const nav = document.querySelector('nav.top')
    if (!nav) return
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // When TidyCal redirects to our thank-you URL inside the iframe (same origin),
  // break out to the full thank-you page. Also catch postMessage booking events.
  useEffect(() => {
    if (step !== 'calendar') return

    const breakOut = () => {
      if (leftForThankYou.current) return
      leftForThankYou.current = true
      goToThankYou(f.name)
    }

    const onMessage = (e) => {
      const data = e.data
      if (!data) return
      const raw = typeof data === 'string' ? data : JSON.stringify(data)
      if (/tidycal|booking.?complete|booking.?confirmed|booked/i.test(raw)) {
        breakOut()
      }
    }

    // Poll iframe location — onLoad alone can miss SPA navigations.
    const poll = setInterval(() => {
      const frame = frameRef.current
      if (!frame) return
      try {
        const href = frame.contentWindow?.location?.href || ''
        if (href.includes(THANKYOU_PATH) || href.includes('/thankyou')) breakOut()
      } catch {
        // Still on tidycal.com (cross-origin) — ignore.
      }
    }, 500)

    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
      clearInterval(poll)
    }
  }, [step, f.name])

  const onFrameLoad = () => {
    const frame = frameRef.current
    if (!frame || leftForThankYou.current) return
    try {
      const href = frame.contentWindow?.location?.href || ''
      if (href.includes(THANKYOU_PATH) || href.includes('/thankyou')) {
        leftForThankYou.current = true
        goToThankYou(f.name)
      }
    } catch {
      // Still on tidycal.com (cross-origin) — ignore.
    }
  }

  const toStep2 = () => {
    setErr('')
    if (!f.name.trim()) return setErr('Please enter your name.')
    if (!f.business.trim()) return setErr('Please enter your business name.')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) return setErr('Please enter a valid email.')
    if (f.phone.replace(/\D/g, '').length < 8) return setErr('Please enter a valid mobile number.')
    if (!f.city) return setErr('Please choose your city.')
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const back = () => {
    setErr('')
    setStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const finish = async () => {
    setErr('')
    if (QUESTIONS.some((q) => !f[q.id])) return setErr('Please answer all five questions.')

    setBusy(true)
    try {
      await submitLead({
        name: f.name.trim(),
        business: f.business.trim(),
        email: f.email.trim(),
        phone: f.phone.trim(),
        city: f.city,
        licensed: f.licensed,
        volume: f.volume,
        website: f.website,
        findYou: f.findYou,
        timeline: f.timeline,
        company_website: trap,
        source: 'buildersite_audit',
        page: typeof window !== 'undefined' ? window.location.pathname : '',
        ts: new Date().toISOString()
      })
    } catch (e) {
      console.error('Lead capture failed:', e)
    }

    try {
      sessionStorage.setItem('bs_lead_name', f.name.trim())
    } catch {
      /* ignore */
    }

    if (BOOKING_URL) {
      const sep = BOOKING_URL.includes('?') ? '&' : '?'
      const thankYou = getThankYouUrl(f.name)
      leftForThankYou.current = false
      setCalSrc(
        `${BOOKING_URL}${sep}name=${encodeURIComponent(f.name.trim())}` +
          `&email=${encodeURIComponent(f.email.trim())}` +
          `&redirect_url=${encodeURIComponent(thankYou)}`
      )
      setBusy(false)
      setStep('calendar')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate(`/thankyou?name=${encodeURIComponent(f.name)}`)
    }
  }

  const onKeyDown = (e) => {
    if (e.key !== 'Enter' || busy || step === 'calendar') return
    e.preventDefault()
    step === 1 ? toStep2() : finish()
  }

  const stepLabel = step === 'calendar' ? '3' : String(step)
  const progWidth = step === 1 ? '33%' : step === 2 ? '66%' : '100%'

  return (
    <div className="bs-root">
      <TopBand />
      <Nav />

      <section className="sec">
        <div className="wrap">
          <div className="center !mx-auto !mb-[2.4rem] !max-w-[640px]">
            <div className="eyebrow">Free build &middot; Licensed builders</div>
            <h2 className="!mt-2">
              {step === 'calendar' ? 'Pick a time that works.' : 'Let us see if we are a fit.'}
            </h2>
            <p className="lede muted !mx-auto !mt-4">
              {step === 'calendar'
                ? `Almost there${firstName ? `, ${firstName}` : ''}. Pick a time below to lock in your call.`
                : 'A few quick questions. If it is a match, you will pick a time to see a free build of your site. There is no upfront cost, ever.'}
            </p>
          </div>

          <div className={`acard${step === 'calendar' ? ' cal' : ''}`}>
            <div className="prog">
              <span className="lab">Step {stepLabel} of 3</span>
              <div className="pbar">
                <i style={{ width: progWidth }} />
              </div>
            </div>

            {step !== 'calendar' && (
              <div className="form" onKeyDown={onKeyDown}>
                {step === 1 && (
                  <div className="astep on">
                    <label htmlFor="name">Full name</label>
                    <input id="name" type="text" autoComplete="name" placeholder="Your name" value={f.name} onChange={set('name')} />

                    <label htmlFor="biz">Building business name</label>
                    <input id="biz" type="text" autoComplete="organization" placeholder="Your company" value={f.business} onChange={set('business')} />

                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" autoComplete="email" placeholder="you@company.com.au" value={f.email} onChange={set('email')} />

                    <label htmlFor="phone">Mobile</label>
                    <input id="phone" type="tel" autoComplete="tel" placeholder="04__ ___ ___" value={f.phone} onChange={set('phone')} />

                    <label htmlFor="city">City</label>
                    <select id="city" value={f.city} onChange={set('city')}>
                      <option value="">Select your city</option>
                      {CITIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      name="company_website"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      value={trap}
                      onChange={(e) => setTrap(e.target.value)}
                      className="absolute left-[-9999px] h-0 w-0 opacity-0"
                    />

                    {err && <div className="err on">{err}</div>}
                    <button className="cta cta-block !mt-[1.4rem]" onClick={toStep2} type="button">
                      Continue
                    </button>
                    <div className="micro">Licensed Australian builders only. Your details stay private.</div>
                  </div>
                )}

                {step === 2 && (
                  <div className="astep on">
                    {QUESTIONS.map((q) => (
                      <div key={q.id}>
                        <label htmlFor={q.id}>{q.label}</label>
                        <select id={q.id} value={f[q.id]} onChange={set(q.id)}>
                          <option value="">Select</option>
                          {q.options.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    ))}

                    {err && <div className="err on">{err}</div>}
                    <button className="cta cta-block !mt-[1.4rem]" onClick={finish} type="button" disabled={busy} style={busy ? { opacity: 0.7 } : undefined}>
                      {busy ? 'Loading times...' : 'See available times'}
                    </button>
                    <button className="aback" onClick={back} type="button">
                      Back
                    </button>
                    <div className="micro">Takes about two minutes. No obligation.</div>
                  </div>
                )}
              </div>
            )}

            {step === 'calendar' && (
              <div className="astep on">
                <button className="aback !mt-0 !mb-2 !text-left" onClick={() => setStep(2)} type="button">
                  &larr; Edit my details
                </button>
                {calSrc ? (
                  <iframe
                    ref={frameRef}
                    className="cal-frame"
                    src={calSrc}
                    title="Book your BuilderSite call"
                    loading="lazy"
                    allow="payment *"
                    onLoad={onFrameLoad}
                  />
                ) : (
                  <div className="micro">Loading available times...</div>
                )}
              </div>
            )}
          </div>

          <div className="trust">
            <span>
              <Tick />
              We build first
            </span>
            <span>
              <Tick />
              Pay only if you love it
            </span>
            <span>
              <Tick />
              You own the code
            </span>
          </div>
        </div>
      </section>

      <Footer showReviewNotice={false} />
    </div>
  )
}
