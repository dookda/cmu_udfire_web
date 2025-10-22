import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import NDMIDrought from './pages/NDMIDrought'
import BurnScar from './pages/BurnScar'
import Biomass from './pages/Biomass'
import FloodSim from './pages/FloodSim'
import HotspotPredicting from './pages/HotspotPredicting'

function App() {
  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<NDMIDrought />} />
            <Route path="burn-scar" element={<BurnScar />} />
            <Route path="biomass" element={<Biomass />} />
            <Route path="flood" element={<FloodSim />} />
            <Route path="hotspot" element={<HotspotPredicting />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
