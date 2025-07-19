import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/Demo'
import RegistrationForm from './components/auth/Registration'
import LoginForm from './components/auth/Login'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App