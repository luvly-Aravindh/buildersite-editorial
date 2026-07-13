import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import logoLight from '/assets/logo-light.png'
import logoDark from '/assets/logo-dark.png'

export function TopBand() {
  return (
    <div className="topband">
      Websites for licensed Australian custom home builders &nbsp;&middot;&nbsp;{' '}
      <b>No upfront cost. Pay only if you love it.</b>
    </div>
  )
}

/** Header logo is centred. Cream lockup on the dark bar, dark lockup once the bar turns light on scroll. */
export function Nav() {
  useEffect(() => {
    const nav = document.querySelector('nav.top')
    if (!nav) return
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className="top">
      <div className="wrap">
        <Link to="/" className="logo" aria-label="BuilderSite home">
          <img className="l-light" src={logoLight} alt="BuilderSite" width="116" height="38" />
          <img className="l-dark" src={logoDark} alt="BuilderSite" width="116" height="38" />
        </Link>
      </div>
    </nav>
  )
}

/**
 * Minimal footer, no links. `legal` line stays honest: VelBuilt is a real build,
 * the other named sites are demonstrations, and reviews are illustrative samples
 * pending verified customer reviews (Australian Consumer Law).
 */
export function Footer({ showReviewNotice = true }) {
  return (
    <footer className="ft">
      <div className="wrap !text-center">
        <img className="ft-logo" src={logoLight} alt="BuilderSite" width="127" height="42" />
        <p className="!mx-auto !mt-[.7rem] !text-[rgba(245,244,240,.66)]">
          Websites for licensed Australian custom home builders. Built before you pay.
        </p>
        <div className="legal !mx-auto">
          VelBuilt (velbuilt.com.au) is a real website built by BuilderSite. Other named sites are
          demonstration builds.{' '}
          {showReviewNotice &&
            'Reviews and ticker activity shown are illustrative samples pending verified customer reviews. '}
          &copy; 2026 BuilderSite &middot; buildersite.co
        </div>
      </div>
    </footer>
  )
}
