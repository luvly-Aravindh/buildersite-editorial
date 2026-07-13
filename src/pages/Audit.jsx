import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBand, Nav, Footer } from '../components/Chrome.jsx'
import { submitLead, BOOKING_URL, thankYouUrl } from '../lib/api.js'

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

export default function Audit() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [f, setF] = useState({
    name: '', business: '', email: '', phone: '', city: '',
    licensed: '', volume: '', website: '', findYou: '', timeline: ''
  })
  // Honeypot. Hidden from people, irresistible to bots. The API drops any lead that fills it.
  const [trap, setTrap] = useState('')

  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value }))

  useEffect(() => {
    const nav = document.querySelector('nav.top')
    if (!nav) return
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
      await submitLead({ ...f, company_website: trap, source: 'buildersite_audit', ts: new Date().toISOString() })
    } catch (e) {
      // Never trap a qualified lead behind a back end hiccup. Log it and keep them moving.
      console.error('Lead capture failed:', e)
    }

    // Persist name so the thank-you page can greet them after TidyCal redirects back.
    try {
      sessionStorage.setItem('bs_lead_name', f.name.trim())
    } catch {
      /* private mode / blocked storage — page still works without a name */
    }

    if (BOOKING_URL) {
      const sep = BOOKING_URL.includes('?') ? '&' : '?'
      const thankYou = thankYouUrl(f.name)
      window.location.href =
        `${BOOKING_URL}${sep}name=${encodeURIComponent(f.name.trim())}` +
        `&email=${encodeURIComponent(f.email.trim())}` +
        `&redirect_url=${encodeURIComponent(thankYou)}`
    } else {
      navigate(`/thankyou?name=${encodeURIComponent(f.name)}`)
    }
  }

  const onKeyDown = (e) => {
    if (e.key !== 'Enter' || busy) return
    e.preventDefault()
    step === 1 ? toStep2() : finish()
  }

  return (
    <div className="bs-root">
      <TopBand />
      <Nav />

      <section className="sec">
        <div className="wrap">
          <div className="center !mx-auto !mb-[2.4rem] !max-w-[640px]">
            <div className="eyebrow">Free build &middot; Licensed builders</div>
            <h2 className="!mt-2">Let us see if we are a fit.</h2>
            <p className="lede muted !mx-auto !mt-4">
              A few quick questions. If it is a match, you will pick a time to see a free build of your site. There is no
              upfront cost, ever.
            </p>
          </div>

          <div className="acard">
            <div className="prog">
              <span className="lab">Step {step} of 2</span>
              <div className="pbar">
                <i style={{ width: step === 1 ? '50%' : '100%' }} />
              </div>
            </div>

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

                  {/* Honeypot: off-screen, not tabbable, not announced. */}
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
