import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Generator from './pages/Generator'
import History from './pages/History'
import Login from './pages/Login'
import Signup from './pages/Signup'
import OrgSetup from './pages/OrgSetup'
import './App.css'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="loading-screen">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading...</p>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AuthRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) {
    if (!user.org_setup_complete) return <Navigate to="/setup" replace />
    return <Navigate to="/" replace />
  }
  return children
}

function SetupRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.company_name
    ? user.company_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'DF'

  return (
    <>
      <nav className="navbar" id="main-navbar">
        <div className="nav-brand">
          <i className="fas fa-file-invoice"></i>
          <span>DocuForge</span>
        </div>
        <div className="nav-center">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} id="nav-generator">
            <i className="fas fa-plus-circle"></i>
            <span>New Document</span>
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} id="nav-history">
            <i className="fas fa-history"></i>
            <span>Document History</span>
          </NavLink>
        </div>
        <div className="nav-user">
          <div className="user-pill">
            <div className="user-avatar">{initials}</div>
            <span className="user-name-nav">{user?.org_name || user?.company_name || 'My Account'}</span>
          </div>
          <button className="btn-icon btn-logout" onClick={handleLogout} title="Logout" id="btn-logout">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Generator />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Routes>
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
          <Route path="/setup" element={<SetupRoute><OrgSetup /></SetupRoute>} />
          <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
