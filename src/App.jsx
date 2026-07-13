import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Editorial from './pages/Editorial.jsx'
import Audit from './pages/Audit.jsx'
import ThankYou from './pages/ThankYou.jsx'

export default function App() {
  return (
    <BrowserRouter basename="/buildersite-editorial">
      <Routes>
        <Route path="/" element={<Editorial />} />
        <Route path="/audit" element={<Audit />} />
        {/* TidyCal redirect uses /thankyou; keep /thank-you as an alias */}
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
