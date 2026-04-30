import Header from './Components/Heder'
import Hero from './Components/Hero'
import Footer from './Components/Footer'
import Login from './Components/Login'
import Register from './Components/Register'
import { Route, Routes } from 'react-router-dom'
import './index.css'
import MapaTiempoReal from './Components/MapaTiempoReal'
import Alertas from './Components/Alertas'
import ReportarIncendio from './Components/ReportarIncendio'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <Header />
            <Hero />
            <Footer />
          </div>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route
        path="/reportar"
        element={
          <div>
            <Header />
            <ReportarIncendio />
            <Footer />
          </div>
        }
      />
      <Route
        path="/alertas"
        element={
          <div>
            <Header />
            <Alertas />
            <Footer />
          </div>
        }
      />
      <Route
        path="/mapa"
        element={
          <div>
            <Header />
            <MapaTiempoReal />
          </div>
        }
      />
    </Routes>
  )
}
export default App
