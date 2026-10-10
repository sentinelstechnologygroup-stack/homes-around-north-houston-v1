import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PageNotFound from './lib/PageNotFound'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Homes from './pages/Homes'
import MarketReports from './pages/MarketReports'
import Legal from './pages/Legal'
import IntentPage from './pages/IntentPage'
import Seo from './components/Seo'

export function SiteRoutes() {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:p-3">Skip to content</a>
      <Seo />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<IntentPage interest="buying" />} />
        <Route path="/sell" element={<IntentPage interest="selling" />} />
        <Route path="/investment-properties" element={<IntentPage interest="investing" />} />
        <Route path="/homes" element={<Homes />} />
        <Route path="/market-reports" element={<MarketReports />} />
        <Route path="/privacy" element={<Legal type="privacy" />} />
        <Route path="/terms" element={<Legal type="terms" />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default function App() { return <Router><SiteRoutes /></Router> }
