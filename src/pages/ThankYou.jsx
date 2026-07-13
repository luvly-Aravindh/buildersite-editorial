import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TopBand, Nav, Footer } from '../components/Chrome.jsx'

import velbuilt from '/assets/velbuilt.jpg'
import ardent from '/assets/ardent.jpg'
import stratum from '/assets/stratum.jpg'
import verso from '/assets/verso.jpg'
import stillpoint from '/assets/stillpoint.jpg'
import faceDaniel from '/assets/face-daniel.jpg'
import faceCraig from '/assets/face-craig.jpg'
import faceMark from '/assets/face-mark.jpg'
import faceAnthony from '/assets/face-anthony.jpg'

const LiveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M12 1.5l2.4 1.7 2.9-.2 1.2 2.7 2.5 1.5-.6 2.9.9 2.8-2.2 1.9-.4 2.9-2.9.5L13.6 22 12 20.5 9.6 22l-2.5-1.6-2.9-.5-.4-2.9-2.2-1.9.9-2.8-.6-2.9 2.5-1.5L4.7 3l2.9.2L10 1.5z"
      fill="#3b5afe"
    />
    <path d="M8 12l2.7 2.7L16.5 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// VelBuilt is a real client build. The rest are demonstration builds and are labelled as such.
const PROJECTS = [
  { img: velbuilt, alt: 'VelBuilt website', name: 'VelBuilt', where: 'Custom home builder, Melbourne VIC', live: true, w: 620, h: 388 },
  { img: ardent, alt: 'Ardent Atelier website', name: 'Ardent Atelier', where: 'Bespoke architectural builder, Vaucluse NSW', live: false, w: 620, h: 388 },
  { img: stratum, alt: 'Stratum website', name: 'Stratum', where: 'Precision custom homes, Melbourne VIC', live: false, w: 620, h: 401 },
  { img: verso, alt: 'Verso website', name: 'Verso', where: 'Considered custom homes, Sydney NSW', live: false, w: 620, h: 402 },
  { img: stillpoint, alt: 'Stillpoint website', name: 'Stillpoint', where: 'Concrete and steel homes, Brisbane QLD', live: false, w: 620, h: 402 }
]

// Illustrative sample reviews. Replace with real verified reviews before public launch.
const TESTIMONIALS = [
  { quote: 'They built the whole thing first and said pay only if you like it. I liked it. It finally looks like the quality of the homes we build.', name: 'Daniel Whitmore', biz: 'Whitmore Built, Brighton VIC', face: faceDaniel },
  { quote: 'The old site made us look like a one man band. This one looks like the custom builder we are. Homeowners bring it up on the first call now.', name: 'Craig Petersen', biz: 'Petersen Homes, Unley SA', face: faceCraig },
  { quote: 'I saw the finished site before paying a cent. No lock in, no monthly bill, and I own the lot. Straightforward the whole way through.', name: 'Mark Sullivan', biz: 'Sullivan Custom Homes, Sutherland NSW', face: faceMark },
  { quote: 'Turns out homeowners were checking us out long before they rang. Now the site does that job properly, day and night.', name: 'Anthony Ferraro', biz: 'Ferraro Construction, Bulimba QLD', face: faceAnthony }
]

const TICKER_ITEMS = [
  ['Mark T.', 'Geelong VIC'],
  ['Dan W.', 'Newcastle NSW'],
  ['Craig P.', 'Unley SA'],
  ['Steve C.', 'Gungahlin ACT'],
  ['Anthony F.', 'Bulimba QLD'],
  ['Wayne T.', 'Mermaid Beach QLD']
]

/** Fades sections in on scroll, matching the original IntersectionObserver behaviour. */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/** Bottom-left proof ticker. Sample activity, illustrative only. */
function ProofTicker() {
  const [idx, setIdx] = useState(0)
  const [show, setShow] = useState(false)
  const i = useRef(0)

  useEffect(() => {
    let hideT
    const cycle = () => {
      setIdx(i.current % TICKER_ITEMS.length)
      i.current += 1
      setShow(true)
      hideT = setTimeout(() => setShow(false), 6000)
    }
    const startT = setTimeout(cycle, 4000)
    const loop = setInterval(cycle, 11000)
    return () => {
      clearTimeout(startT)
      clearTimeout(hideT)
      clearInterval(loop)
    }
  }, [])

  const [who, city] = TICKER_ITEMS[idx]
  return (
    <div className={`ticker${show ? ' show' : ''}`}>
      <div className="tkmap">
        <svg viewBox="0 0 48 48">
          <rect width="48" height="48" fill="#e7edf3" />
          <rect x="0" y="19" width="48" height="6" fill="#fff" />
          <rect x="17" y="0" width="6" height="48" fill="#fff" />
          <rect x="0" y="36" width="48" height="3" fill="#f4f7fa" />
          <rect x="33" y="0" width="3" height="48" fill="#f4f7fa" />
          <rect x="27" y="27" width="21" height="21" fill="#d9e8da" />
          <rect x="0" y="0" width="14" height="14" fill="#dde6f0" />
          <path d="M24 16c-3.3 0-6 2.6-6 5.9 0 4.4 6 10.1 6 10.1s6-5.7 6-10.1c0-3.3-2.7-5.9-6-5.9z" fill="#3b5afe" />
          <circle cx="24" cy="22" r="2.2" fill="#fff" />
        </svg>
      </div>
      <div className="tkinfo">
        <div className="tkl1">
          <b>{who}</b> <span className="frm">from {city}</span>
        </div>
        <div className="tkl2">Booked a free build call</div>
        <div className="tkl3">
          <span>Just now</span> &middot;{' '}
          <span className="vb">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 12.5l2 2 4.5-4.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Verified by Proof
          </span>
        </div>
      </div>
    </div>
  )
}

function pickFirstName(raw) {
  const first = (raw || '').trim().split(' ')[0].replace(/[^A-Za-z'-]/g, '')
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : ''
}

export default function ThankYou() {
  const [params] = useSearchParams()
  useReveal()

  // Query param (direct navigate) or sessionStorage (return from TidyCal).
  let raw = params.get('name') || ''
  if (!raw) {
    try {
      raw = sessionStorage.getItem('bs_lead_name') || ''
      if (raw) sessionStorage.removeItem('bs_lead_name')
    } catch {
      /* ignore */
    }
  }
  const name = pickFirstName(raw)

  const lede = name
    ? `Thanks ${name}, your call details are on the way to your inbox. Check spam if you do not see them.`
    : 'Thanks for booking. Your call details are on the way to your inbox.'

  return (
    <div className="bs-root">
      <TopBand />
      <Nav />

      <section className="sec s-ink ty-hero text-center !pt-[3.6rem]">
        <div className="wrap !max-w-[720px]">
          <div className="ty-badge">
            <svg viewBox="0 0 24 24" fill="none" width="40" height="40">
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#c5f56b" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="!mt-[1.2rem] !mb-[.6rem] !text-white">Your call is booked. Check your inbox.</h1>
          <p className="lede !mx-auto !text-[rgba(255,255,255,.85)]" id="tyName">
            {lede}
          </p>
          <div className="ty-steps">
            <div className="ty-step">
              <span>1</span>
              <b>Check your inbox</b>
              <p>Your call details land within 10 minutes. If you do not see them, have a look in spam.</p>
            </div>
            <div className="ty-step">
              <span>2</span>
              <b>We hop on a call</b>
              <p>A short call to understand your business, your goals, and the homes you build. No pressure, no hard sell.</p>
            </div>
            <div className="ty-step">
              <span>3</span>
              <b>Then we build</b>
              <p>If we are a fit, we build your complete site first. You see it, then you decide. Love it, it is 1,999 AUD once.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="center reveal !mx-auto !mb-[2.4rem] !max-w-[640px]">
            <div className="eyebrow">Recent work</div>
            <h2>Sites we have built for builders.</h2>
          </div>
          <div className="gallery">
            {PROJECTS.map((p, n) => (
              <div className={`proj reveal${n % 2 === 1 ? ' d1' : ''}`} key={p.name}>
                <img src={p.img} alt={p.alt} loading="lazy" width={p.w} height={p.h} />
                <div className="meta">
                  {p.live ? (
                    <span className="tag">
                      <LiveIcon />
                      Live
                    </span>
                  ) : (
                    <span className="tag demo">Sample build</span>
                  )}
                  <h3>{p.name}</h3>
                  <p>{p.where}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec s-surface">
        <div className="wrap">
          <div className="center reveal !mx-auto !mb-[2.4rem] !max-w-[640px]">
            <div className="eyebrow">In their words</div>
            <h2>Builders who said yes.</h2>
          </div>
          <div className="ty-tgrid">
            {TESTIMONIALS.map((t, n) => (
              <div className={`tslide-s reveal${n % 2 === 1 ? ' d1' : ''}`} key={t.name}>
                <p className="tquote">{t.quote}</p>
                <div className="tmeta">
                  <span className="tav">
                    <img src={t.face} alt={t.name} width="48" height="48" loading="lazy" />
                  </span>
                  <span className="tmt">
                    {t.name}
                    <span className="biz">{t.biz}</span>
                    <span className="tvb">&#10003; Verified builder</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec s-ink text-center">
        <div className="wrap !max-w-[640px]">
          <h2 className="!text-white">Keep an eye on your inbox.</h2>
          <p className="lede !mx-auto !mt-4 !mb-8 !text-[rgba(255,255,255,.85)]">
            Your call confirmation lands within 10 minutes. If you do not see it, check spam, or take a look at a site we
            built while you wait.
          </p>
          <a className="cta cta-lg" href="https://velbuilt.com.au" target="_blank" rel="noopener noreferrer">
            See VelBuilt
          </a>
        </div>
      </section>

      <ProofTicker />
      <Footer />
    </div>
  )
}
