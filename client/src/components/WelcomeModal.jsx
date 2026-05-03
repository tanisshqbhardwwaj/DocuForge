import { useState, useEffect } from 'react'

export default function WelcomeModal({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(false)

  useEffect(() => {
    const hasVisited = localStorage.getItem('df_visited')
    if (!hasVisited) {
      setIsFirstVisit(true)
      localStorage.setItem('df_visited', 'true')
      setIsOpen(true)
    } else {
      // For returning users, maybe show once per session?
      const sessionSeen = sessionStorage.getItem('df_session_seen')
      if (!sessionSeen) {
        setIsFirstVisit(false)
        sessionStorage.setItem('df_session_seen', 'true')
        setIsOpen(true)
      }
    }
  }, [])

  if (!isOpen) return null

  const initials = user?.company_name
    ? user.company_name[0].toUpperCase()
    : user?.email?.[0].toUpperCase() || '?'

  return (
    <div className="modal-overlay welcome-modal-overlay">
      <div className="welcome-modal glass-card animate-pop">
        <div className="confetti-container">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`confetti c${i+1}`}></div>
          ))}
        </div>
        
        <div className="welcome-avatar">
          {initials}
        </div>

        <h2 className="welcome-title">
          {isFirstVisit ? 'Welcome aboard,' : 'Welcome back,'}
          <br />
          <span>{user?.org_name || user?.company_name || 'Business Partner'}!</span>
        </h2>

        <p className="welcome-text">
          {isFirstVisit 
            ? "Thank you for choosing DocuForge. Before you start, we'd love to show you around and help you navigate the app."
            : "Great to see you again! Your documents and data are ready for you to pick up where you left off."}
        </p>

        <div className="welcome-actions">
          <button className="btn btn-primary btn-full" onClick={() => setIsOpen(false)}>
            {isFirstVisit ? 'Show Me Around' : 'Get Started'}
          </button>
          <button className="btn btn-ghost btn-full" onClick={() => setIsOpen(false)}>
            No thanks, I'll explore it.
          </button>
        </div>
      </div>
    </div>
  )
}
