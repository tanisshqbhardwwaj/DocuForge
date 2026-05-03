import { useState, useEffect } from 'react'

export default function GuidedTour({ onComplete }) {
  const [step, setStep] = useState(0)
  const [style, setStyle] = useState({})

  const steps = [
    {
      target: '#main-navbar .nav-brand',
      title: 'Welcome to DocuForge',
      text: 'This is your professional billing suite. We help you create and manage GST-compliant documents with ease.',
      pos: 'bottom'
    },
    {
      target: '#nav-generator',
      title: 'Document Generator',
      text: 'Create new Invoices, Purchase Orders, and Proformas here. All your business details are auto-filled!',
      pos: 'bottom'
    },
    {
      target: '#nav-history',
      title: 'Document History',
      text: 'View, download, or delete your previously generated documents. Keep track of your billing in one place.',
      pos: 'bottom'
    },
    {
      target: '#document-form',
      title: 'Powerful Forms',
      text: 'Fill in client details and items. We handle all the GST calculations and subtotals for you.',
      pos: 'right'
    },
    {
      target: '.nav-user',
      title: 'Your Profile',
      text: 'Manage your organization settings or logout safely from here.',
      pos: 'bottom'
    }
  ]

  useEffect(() => {
    const updatePosition = () => {
      const currentStep = steps[step]
      const el = document.querySelector(currentStep.target)
      if (el) {
        const rect = el.getBoundingClientRect()
        const padding = 8
        
        setStyle({
          top: rect.top - padding,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
          opacity: 1
        })

        // Scroll into view if needed
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        // If element not found (e.g. on different page), just skip to next or finish
        if (step < steps.length - 1) setStep(s => s + 1)
        else onComplete()
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [step])

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div className="tour-overlay">
      <div className="tour-highlight" style={style}></div>
      
      <div className="tour-popover animate-pop" style={{
        top: steps[step].pos === 'bottom' ? style.top + style.height + 20 : 
             steps[step].pos === 'right' ? style.top : '50%',
        left: steps[step].pos === 'right' ? style.left + style.width + 20 : 
              style.left + (style.width / 2) - 150,
        transform: steps[step].pos === 'bottom' ? 'none' : 
                   steps[step].pos === 'right' ? 'none' : 'translate(-50%, -50%)'
      }}>
        <div className="tour-step-indicator">Step {step + 1} of {steps.length}</div>
        <h3 className="tour-title">{steps[step].title}</h3>
        <p className="tour-text">{steps[step].text}</p>
        
        <div className="tour-footer">
          <button className="btn btn-ghost btn-sm" onClick={onComplete}>Skip Tour</button>
          <button className="btn btn-primary btn-sm" onClick={handleNext}>
            {step === steps.length - 1 ? 'Finish' : 'Next'} <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  )
}
