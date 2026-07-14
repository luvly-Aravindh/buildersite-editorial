import { useEffect } from 'react'
import heroImage from "../components/Hero_Main.webp"; // Update the path as needed
import inlineImage from "../components/home_2.png"; // Update the path if needed
import velBuiltImage from "../components/velbuilt.png"; // Update the path if needed

const base = import.meta.env.BASE_URL

/**
 * Editorial advertorial. Markup and CSS carried over verbatim from the
 * approved HTML build (rules scoped under .editorial-root in pages.css),
 * so the newspaper design renders pixel-for-pixel as signed off.
 */
export default function Editorial() {
  useEffect(() => {
    const opts = { timeZone: 'Australia/Sydney' }
    const dLong = (d) =>
      d.toLocaleDateString('en-AU', { ...opts, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    const dShort = (d) =>
      d.toLocaleDateString('en-AU', { ...opts, month: 'long', day: 'numeric', year: 'numeric' })
    const t24 = (d) =>
      d.toLocaleTimeString('en-GB', { ...opts, hour: '2-digit', minute: '2-digit', hour12: false })

    const now = new Date()
    const pub = new Date(now.getTime() - (180 + Math.floor(Math.random() * 180)) * 60000)
    const upd = new Date(now.getTime() - (35 + Math.floor(Math.random() * 60)) * 60000)

    const td = document.getElementById('topdate')
    if (td) td.textContent = dLong(now)
    const pm = document.getElementById('pubmeta')
    if (pm) pm.textContent = `Published ${dShort(pub)} ${t24(pub)} AEST \u00b7 Updated ${t24(upd)} AEST`
  }, [])

  return (
    <div className="editorial-root">
      {/* ============================================================
           BuilderSite Editorial Advertorial. v3.
           Australian Builder masthead. CTAs point to the audit funnel.
           SAMPLE CONTENT: featured quote, results cards and comments are
           illustrative placeholders with fictional names. They look real for
           the client pitch, but MUST be replaced with real, verified builder
           testimonials before this page is published (Australian Consumer Law
           / ACCC). Do not publish invented reviews.
           Also swap: hero + 2 photo placeholders, VelBuilt screenshot.
           Publication name "Australian Builder" swaps in the nameplate + footer.
           ============================================================ */}

      <div className="util"><div className="util-in"><span id="topdate">Tuesday, July 7, 2026</span><span className="ulinks"><a href="#">e-Paper</a> &#183; <a href="#">Subscribe</a> &#183; <a href="#">Sign In</a></span></div></div>
      <div className="np"><div className="name"><b>AUSTRALIAN</b> <span>BUILDER</span></div><div className="tag">Homes &#183; Trade &#183; The Business of Building</div></div>
      <nav className="nav"><div className="nav-in"><a href="#">Home</a><a href="#">News</a><a href="#">Projects</a><a href="#" className="active">Business</a><a href="#">Design</a><a href="#">Marketing</a><a href="#">Opinion</a><span className="sp"></span><a className="sub" href="#">Subscribe</a></div></nav>

      <div className="container">
      <div className="main">
        <div className="crumb"><a href="#">Home</a> &#8250; <b>Business</b></div>
        <h1>Why Australia's custom home builders keep losing jobs before the first phone call</h1>
        <div className="standfirst ui">They do the work, quote fairly, and never hear back. A growing number of builders are discovering the job was decided online, long before the phone rang, and turning to a small studio that builds the whole website first and only charges if they love it.</div>
        <div className="byline"><div className="mono">AB</div><div><div className="who">By the <b>Australian Builder</b> Desk</div><div className="meta">Melbourne &#183; <span id="pubmeta">Published July 7, 2026 06:30 AEST &#183; Updated 09:10 AEST</span></div></div>
          <div className="share"><span>f</span><span>X</span><span>&#9993;</span></div>
        </div>

<div className="hero">
  <div className="hero-r">
    <img
      src={heroImage}
      alt="Custom home nearing completion"
      className="hero-image"
      width={702}
      height={412}
      loading="eager"
    />
  </div>

  <div className="heroc">
    A custom home nearing completion. For a growing number of builders, the job
    is now won or lost online, long before a homeowner picks up the phone.
    <span className="cr">Courtesy: BuilderSite</span>
  </div>
</div>
        <div className="body">
          <p className="lead">For years, the way to win a custom home build looked the same. Get listed in the directories, put your number on the truck, and wait for the phone to ring. But across Melbourne, Sydney and the Gold Coast, a quieter shift is under way. A growing number of builders are walking away from paid directory listings and cheap template sites, and handing the job to a small studio with one unusual rule: it builds your entire website first, and you only pay if you love it.</p>
          <p>The studio is BuilderSite. Its founder, Arul Prakash, is blunt about the problem most builders never notice. The job is now decided on a screen, at night, long before anyone picks up the phone.</p>

          <h2>The problem most builders never see</h2>
          <p>Talk to enough builders and the same story repeats. The work is good. The quote is fair. The homeowner seemed keen. Then the phone goes quiet, and a few weeks later someone else is on the block.</p>
          <p>It is easy to blame price. Most of the time, price was never the problem. The homeowner had already ruled the builder out before the first call, somewhere the builder could not see.</p>

          <div className="alsoread"><span className="k">Also Read</span><a href="#">Why homeowners now judge a builder in eight seconds</a></div>

          <h2>A different way to look at a website</h2>
          <p>BuilderSite starts from the homeowner, not the builder. A custom home is the biggest cheque most families will ever write, so before they call anyone, they look you up. Your website loads, and in about eight seconds they have decided whether you look like a builder they can trust.</p>
          <p>That verdict happens in silence. The builder is not in the room and never gets to explain the twenty years on the tools. A slow or dated site does not read as an honest tradesman. To a nervous homeowner it reads as risk, and nobody books a risk.</p>
          <div className="chartcard"><div className="ct">Homeowners looked you up. Almost none called.</div><div className="cs">Illustrative pattern</div><svg viewBox="0 0 680 340" width="100%" xmlns="http://www.w3.org/2000/svg"><polygon points="70,292 184,270 298,238 406,196 520,150 632,108 632,285 520,287 406,283 298,289 184,286 70,290" fill="#c0392b" opacity="0.09" /><line x1="62" y1="34" x2="62" y2="300" stroke="#d7dbe0" strokeWidth="2" /><line x1="62" y1="300" x2="636" y2="300" stroke="#d7dbe0" strokeWidth="2" /><polyline points="70,292 184,270 298,238 406,196 520,150 632,108" fill="none" stroke="#5b6472" strokeWidth="3.5" strokeLinejoin="round" /><polyline points="70,290 184,286 298,289 406,283 520,287 632,285" fill="none" stroke="#1a4fa3" strokeWidth="3.5" strokeLinejoin="round" /><circle cx="632" cy="108" r="5" fill="#5b6472" /><circle cx="632" cy="285" r="5" fill="#1a4fa3" /><text x="70" y="320" fontFamily="Inter" fontSize="13" fill="#9aa0a6" textAnchor="middle">Jan</text><text x="184" y="320" fontFamily="Inter" fontSize="13" fill="#9aa0a6" textAnchor="middle">Feb</text><text x="298" y="320" fontFamily="Inter" fontSize="13" fill="#9aa0a6" textAnchor="middle">Mar</text><text x="406" y="320" fontFamily="Inter" fontSize="13" fill="#9aa0a6" textAnchor="middle">Apr</text><text x="520" y="320" fontFamily="Inter" fontSize="13" fill="#9aa0a6" textAnchor="middle">May</text><text x="632" y="320" fontFamily="Inter" fontSize="13" fill="#9aa0a6" textAnchor="middle">Jun</text><circle cx="74" cy="18" r="5" fill="#5b6472" /><text x="86" y="23" fontFamily="Inter" fontSize="14" fill="#5b6472">Looked you up online</text><circle cx="250" cy="18" r="5" fill="#1a4fa3" /><text x="262" y="23" fontFamily="Inter" fontSize="14" fill="#1a4fa3">Actually called</text></svg><div className="ccap">The homeowners quietly checking you out, against the few who ever make contact. The shaded gap is work already lost.</div></div>

          <h2>The leak between a search and a call</h2>
          <p>The studio's view is that most builders do not have a marketing problem at all. They have a leak. Out of 100 homeowners who find a builder online, most leave within seconds, and only a handful ever make contact. By the time anyone is on the phone, the number is tiny.</p>
          <p>Builders, in other words, are being judged and rejected before they even know a homeowner exists. <b>Fixing that first impression, not paying for more clicks, is the whole pitch.</b></p>
          <div className="chartcard"><div className="ct">What happens to 100 homeowners who find you online</div><div className="cs">Illustrative funnel</div><svg viewBox="0 0 680 300" width="100%" xmlns="http://www.w3.org/2000/svg"><text x="14" y="53" fontFamily="Inter" fontWeight="600" fontSize="15" fill="#1a1a1a">Find you</text><rect x="182" y="30" width="400.0" height="34" rx="4" fill="#dde2ea" /><text x="592.0" y="53" fontFamily="Inter" fontWeight="800" fontSize="15" fill="#1a1a1a">100</text><text x="14" y="105" fontFamily="Inter" fontWeight="600" fontSize="15" fill="#1a1a1a">Click site</text><rect x="182" y="82" width="248.0" height="34" rx="4" fill="#1a4fa3" /><text x="440.0" y="105" fontFamily="Inter" fontWeight="800" fontSize="15" fill="#1a1a1a">62</text><text x="14" y="157" fontFamily="Inter" fontWeight="600" fontSize="15" fill="#1a1a1a">Stay 8s</text><rect x="182" y="134" width="96.0" height="34" rx="4" fill="#1a4fa3" /><text x="288.0" y="157" fontFamily="Inter" fontWeight="800" fontSize="15" fill="#1a1a1a">24</text><text x="14" y="209" fontFamily="Inter" fontWeight="600" fontSize="15" fill="#1a1a1a">Trust you</text><rect x="182" y="186" width="56.0" height="34" rx="4" fill="#1a4fa3" /><text x="248.0" y="209" fontFamily="Inter" fontWeight="800" fontSize="15" fill="#1a1a1a">14</text><text x="14" y="261" fontFamily="Inter" fontWeight="600" fontSize="15" fill="#1a1a1a">Call</text><rect x="182" y="238" width="32.0" height="34" rx="4" fill="#12386f" /><text x="224.0" y="261" fontFamily="Inter" fontWeight="800" fontSize="15" fill="#1a1a1a">8</text></svg><div className="ccap">Every homeowner lost in the first seconds is a job that never becomes a phone call. Fix the first impression and the same traffic fills a diary.</div></div>
<figure className="inline">
  <div className="inline-media">
    <img
      src={inlineImage}
      alt="Homeowner comparing builders on a phone"
      className="inline-image"
      width={702}
      height={412}
      loading="lazy"
    />
  </div>

  <figcaption className="cap">
  For a growing number of Australian builders, the next project is won or lost before the first conversation
    <br></br><span
      style={{
        color: "#9aa0a6",
        textTransform: "uppercase",
        fontSize: "10.5px",
        letterSpacing: ".06em",
      }}
    >
      {" "}
      Photo: BuilderSite
    </span>
  </figcaption>
</figure>
          <div className="ftest"><div className="q">"I was cautious about handing my website to anyone after the last mob. They built the whole thing first and said pay only if you like it. I liked it. It finally looks like the quality of the homes we actually build."</div><div className="a">Daniel Whitmore <span>&#183; Whitmore Built, Brighton VIC</span></div></div>

          <div className="alsoread"><span className="k">Also Read</span><a href="#">What a nervous homeowner checks before making contact</a></div>

          <h2>The 2026 edge: an assistant that never sleeps</h2>
          <p>What has sharpened the shift is a small piece of technology. Alongside the website, BuilderSite can add an assistant that answers a homeowner's questions the moment they ask, day or night, so an enquiry made at 11pm does not go cold by morning.</p>
          <p>The studio is careful not to oversell it. A chatbot bolted onto a poor website, Arul says, just answers questions for a homeowner who has already decided to leave. It works only because it sits on a site built to earn trust in the first place. The assistant is an optional add-on, not the fix.</p>
          <figure className="portrait">
            <img src={`${base}assets/ceo.png`} alt="Arul Prakash, founder of BuilderSite" />
            <div className="cap">Arul Prakash, founder of BuilderSite.</div>
          </figure>

          <div className="cta-wrap"><a className="cta-btn" href={`${base}audit`}>Get Your Website Built Free</a><div className="cta-sub">BuilderSite builds your whole site first &#183; you pay only if you love it &#183; a limited number of builds each month</div></div>

          <h2>One we have actually built</h2>
          <p>The proof BuilderSite points to is not a wall of logos. It is a live site. VelBuilt, a custom home builder in Melbourne, is a real website the studio designed and built, and it is online now at velbuilt.com.au. A handful of other names, including ardent-atelier and stratum, are demonstration builds the studio uses to show its work.</p>
<figure className="inline">
  <div className="inline-media">
    <img
      src={velBuiltImage}
      alt="VelBuilt website screenshot"
      className="inline-image"
      width={702}
      height={412}
      loading="lazy"
    />
  </div>

  <figcaption className="cap">
    <b>VelBuilt</b>, custom home builders in Melbourne. A real site, designed
    and built by BuilderSite. <strong>velbuilt.com.au</strong>
  </figcaption>
</figure>
          <div className="chartcard"><div className="ct">What a site built to win trust does</div><div className="cs">Illustrative pattern</div><svg viewBox="0 0 680 326" width="100%" xmlns="http://www.w3.org/2000/svg"><line x1="58" y1="290" x2="642" y2="290" stroke="#d7dbe0" strokeWidth="2" /><rect x="188" y="214" width="70" height="76" rx="4" fill="#dde2ea" /><text x="223.0" y="206" fontFamily="Inter" fontWeight="700" fontSize="14" fill="#888" textAnchor="middle">Few</text><rect x="278" y="70" width="70" height="220" rx="4" fill="#1a4fa3" /><text x="313.0" y="62" fontFamily="Inter" fontWeight="700" fontSize="14" fill="#12386f" textAnchor="middle">Many</text><text x="268" y="311" fontFamily="Inter" fontSize="12" fill="#9aa0a6" textAnchor="middle">Homeowners who make contact</text><rect x="420" y="238" width="70" height="52" rx="4" fill="#dde2ea" /><text x="455.0" y="230" fontFamily="Inter" fontWeight="700" fontSize="14" fill="#888" textAnchor="middle">Low</text><rect x="510" y="120" width="70" height="170" rx="4" fill="#1a4fa3" /><text x="545.0" y="112" fontFamily="Inter" fontWeight="700" fontSize="14" fill="#12386f" textAnchor="middle">High</text><text x="500" y="311" fontFamily="Inter" fontSize="12" fill="#9aa0a6" textAnchor="middle">Trust at first glance</text><rect x="58" y="12" width="14" height="14" fill="#dde2ea" /><text x="78" y="24" fontFamily="Inter" fontSize="13" fill="#888">Risky looking site</text><rect x="240" y="12" width="14" height="14" fill="#1a4fa3" /><text x="260" y="24" fontFamily="Inter" fontSize="13" fill="#1a1a1a">Site built to earn trust</text></svg><div className="ccap">Illustrative only. The same builder, the same work, judged on two different websites.</div></div>

          <h2>Why they only take a handful of builders</h2>
          <p>The most unusual part of the model is how few builders BuilderSite takes on. The studio works with only a handful at a time, and keeps each builder's area exclusive, so a direct competitor down the road cannot hire the same team.</p>
          <p>It is a deliberate choice. Arul and a small team build each site personally, so the numbers stay small and every build gets the attention a million dollar business deserves.</p>

          <h2>You pay nothing unless you love it</h2>
          <p>The selectivity comes with a promise most web companies will not make. BuilderSite designs and builds the entire website first, written, designed and live, and the builder sees the finished site before paying a cent. Love it, and it is a one-time fee of 1,999 AUD, taken in two parts. Do not, and you walk away, and it has cost nothing. The builder owns the code either way.</p>

          <h2>The bottom line</h2>
          <p>For builders sitting on great work and a quiet phone, the message is uncomfortable but simple. The job is being decided online, in the eight seconds before the call, and that first impression is fixable.</p>
          <p>BuilderSite offers to build a full website first and only charge if the builder keeps it. With only a handful of builds each month, the openings tend to fill quickly.</p>
          <div className="cta-wrap"><a className="cta-btn" href={`${base}audit`}>Apply for a Free Build</a><div className="cta-sub">Built first &#183; you pay only if you love it &#183; 1,999 AUD one-time if you keep it, nothing if you do not</div></div>
        </div>

        <div className="results">
          <h3>What builders say</h3>
          <div className="rsub">Early reviews from builders we have worked with</div>
          <div className="rcard"><div className="av" style={{background: '#8a6b4a'}}>CP</div><div><div className="q">"The old site made us look like a one man band. This one looks like the custom builder we are. Homeowners bring it up on the first call now, and more of those calls start the right way."</div><div className="n">Craig Petersen <span>&#183; Petersen Homes, Unley SA</span></div></div></div>
          <div className="rcard"><div className="av" style={{background: '#46708a'}}>MS</div><div><div className="q">"What sold me was seeing the finished site before paying a cent. No lock in, no monthly bill, and I own the lot. Straightforward the whole way through."</div><div className="n">Mark Sullivan <span>&#183; Sullivan Custom Homes, Sutherland NSW</span></div></div></div>
          <div className="rcard"><div className="av" style={{background: '#6b5f8a'}}>AF</div><div><div className="q">"I always thought a website did not matter much for custom work. Turns out homeowners were checking us out long before they rang. Now the site does that job properly."</div><div className="n">Anthony Ferraro <span>&#183; Ferraro Construction, Bulimba QLD</span></div></div></div>
        </div>
        <section className="comments">
          <h3>Comments</h3>
          <div className="csort">Reviews from builders &#183; sorted by newest</div>
          <div className="composer"><div className="ph"></div><div className="inp">Write a comment...</div></div>
          <div className="cmt"><div className="av" style={{background: '#4f6486'}}>SC</div><div className="b2"><div className="bub"><span className="nm">Steve Callaghan</span><span className="vb">&#10003; Verified builder</span><div className="role">Callaghan Residential, Gungahlin ACT</div><div className="tx">Been putting off sorting the website for two years. Build first and pay only if you like it took the risk out of it. Wish I had done it sooner.</div></div><div className="meta"><span className="lk">Like</span><span>Reply</span><span className="lc"><i></i>12</span><span>1w</span></div><div className="reply"><div className="cmt"><div className="av" style={{background: '#111'}}>AP</div><div className="b2"><div className="bub"><span className="nm">Arul Prakash</span><span className="vb author">Founder</span><div className="tx">Thanks Steve. That was the whole idea, you should not have to gamble on it.</div></div><div className="meta"><span className="lk">Like</span><span>Reply</span><span>1w</span></div></div></div></div></div></div>
          <div className="cmt"><div className="av" style={{background: '#8a6b4a'}}>WT</div><div className="b2"><div className="bub"><span className="nm">Wayne Trask</span><span className="vb">&#10003; Verified builder</span><div className="role">Trask and Sons Building, Mermaid Beach QLD</div><div className="tx">The bit I liked most is we own the code and there is no monthly fee hanging over us. Site is quick and looks the part.</div></div><div className="meta"><span className="lk">Like</span><span>Reply</span><span className="lc"><i></i>7</span><span>2w</span></div></div></div>
          <div className="cmt"><div className="av" style={{background: '#46708a'}}>CP</div><div className="b2"><div className="bub"><span className="nm">Craig Petersen</span><span className="vb">&#10003; Verified builder</span><div className="role">Petersen Homes, Unley SA</div><div className="tx">Homeowners mention it on the first call now. Feels like it finally matches the standard of the builds.</div></div><div className="meta"><span className="lk">Like</span><span>Reply</span><span className="lc"><i></i>5</span><span>3w</span></div><div className="reply"><div className="cmt"><div className="av" style={{background: '#111'}}>AP</div><div className="b2"><div className="bub"><span className="nm">Arul Prakash</span><span className="vb author">Founder</span><div className="tx">Appreciate it Craig.</div></div><div className="meta"><span className="lk">Like</span><span>Reply</span><span>3w</span></div></div></div></div></div></div>
          <div className="cmt"><div className="av" style={{background: '#6b5f8a'}}>AF</div><div className="b2"><div className="bub"><span className="nm">Anthony Ferraro</span><span className="vb">&#10003; Verified builder</span><div className="role">Ferraro Construction, Bulimba QLD</div><div className="tx">Was skeptical about the whole build first thing. It is legit. Saw the finished site, then paid.</div></div><div className="meta"><span className="lk">Like</span><span>Reply</span><span className="lc"><i></i>4</span><span>1mo</span></div></div></div>
        </section>
      </div>

      <aside className="aside"><div className="stick">
        <div className="widget"><h4>Most Read</h4>
          <div className="mr"><div className="num">1</div><a href="#">Why homeowners rule out builders before they call</a></div>
          <div className="mr"><div className="num">2</div><a href="#">The eight seconds that decide who wins the job</a></div>
          <div className="mr"><div className="num">3</div><a href="#">Inside the rise of AI assistants for home builders</a></div>
          <div className="mr"><div className="num">4</div><a href="#">What a nervous homeowner checks before making contact</a></div>
          <div className="mr"><div className="num">5</div><a href="#">Five things every builder's website gets wrong</a></div>
        </div>
        <div className="widget"><div className="adslot"><div className="l">Advertisement</div><div className="m">A few free builds open this month.</div><a className="cta-btn" style={{fontSize: '14px', padding: '12px 20px'}} href={`${base}audit`}>Get Your Free Site</a></div></div>
        <div className="widget follow"><h4>Follow Us</h4><a href="#">f</a><a href="#">X</a><a href="#">in</a><a href="#">&#9993;</a></div>
      </div></aside>
      </div>

      <footer>
        <div className="fg">
          <div><div className="fname">Australian Builder</div><div className="ftag">News, projects and the business of building, for the people who build Australia's homes.</div><div className="fsoc"><a href="#">f</a><a href="#">X</a><a href="#">in</a></div></div>
          <div><h4>Sections</h4><a href="#">News</a><a href="#">Projects</a><a href="#">Business</a><a href="#">Design</a><a href="#">Marketing</a><a href="#">Opinion</a></div>
          <div><h4>Company</h4><a href="#">About Us</a><a href="#">Editorial Team</a><a href="#">Careers</a><a href="#">Advertise</a><a href="mailto:hello@buildersite.co">Contact</a></div>
          <div><h4>Legal</h4><a href="#">Privacy Policy</a><a href="#">Terms of Use</a><a href="#">Disclaimer</a><a href="#">Sitemap</a></div>
        </div>
        <div className="fbot"><b>ADVERTORIAL DISCLOSURE:</b> This is a sponsored feature (advertorial) produced for BuilderSite and does not represent independent editorial coverage. VelBuilt (velbuilt.com.au) is a real website built by BuilderSite; other named sites are demonstration builds. Testimonials and comments shown are illustrative samples pending verified customer reviews, and will be replaced before this feature is published. Charts marked illustrative are conceptual, not client results. Individual results vary.<br /><br /><b>META DISCLAIMER:</b> This site is not a part of the Facebook or Instagram website or Meta Platforms, Inc. It is also not endorsed by Meta in any way. FACEBOOK, INSTAGRAM and META are trademarks of Meta Platforms, Inc.<br />&#169; 2026 Australian Builder. All rights reserved. <a href="#">Privacy</a> &#183; <a href="#">Terms</a> &#183; <a href="mailto:hello@buildersite.co">Contact</a></div>
      </footer>
    </div>
  )
}
