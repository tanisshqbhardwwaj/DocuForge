import { useState, useEffect } from "react";

export default function GuidedTour({ onComplete }) {
  const [step, setStep] = useState(0);
  const [style, setStyle] = useState({});

  const steps = [
    {
      target: "#main-navbar .nav-brand",
      title: "Welcome to DocuForge",
      text: "This is your professional billing suite. We've designed it to make document creation fast and beautiful.",
      pos: "bottom",
    },
    {
      target: ".selection-grid",
      title: "Choose Your Document",
      text: "Pick between Invoice, Credit Note, or Purchase Order. We'll set up the right template for you instantly!",
      pos: "bottom",
    },
    {
      target: "#nav-history",
      title: "Your History",
      text: "Every document you save is stored here. You can download PDFs, send emails, or track payment status at any time.",
      pos: "bottom",
    },
    {
      target: ".nav-user",
      title: "Business Profile",
      text: "Set up your company logo, GST details, and contact info here to auto-fill them on every new bill.",
      pos: "bottom",
    },
  ];

  useEffect(() => {
    let timeout;
    const updatePosition = () => {
      const currentStep = steps[step];
      const el = document.querySelector(currentStep.target);

      if (el) {
        const rect = el.getBoundingClientRect();
        const padding = 8;

        setStyle({
          top: rect.top - padding,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
          opacity: 1,
        });

        // Scroll into view if needed
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        // Retry once after a short delay if element not found
        timeout = setTimeout(() => {
          const retryEl = document.querySelector(currentStep.target);
          if (!retryEl) {
            if (step < steps.length - 1) setStep((s) => s + 1);
            else onComplete();
          } else {
            updatePosition();
          }
        }, 500);
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      clearTimeout(timeout);
    };
  }, [step]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      onComplete();
    }
  };

  const popoverWidth = 300;
  const margin = 20;

  let popoverTop = 0;
  let popoverLeft = 0;

  if (steps[step].pos === "bottom") {
    popoverTop = (style.top || 0) + (style.height || 0) + margin;
    popoverLeft = (style.left || 0) + (style.width || 0) / 2 - popoverWidth / 2;
  } else if (steps[step].pos === "right") {
    popoverTop = style.top || 0;
    popoverLeft = (style.left || 0) + (style.width || 0) + margin;
  } else {
    popoverTop = window.innerHeight / 2 - 100;
    popoverLeft = window.innerWidth / 2 - popoverWidth / 2;
  }

  // Boundary checks
  popoverLeft = Math.max(
    margin,
    Math.min(popoverLeft, window.innerWidth - popoverWidth - margin),
  );
  popoverTop = Math.max(margin, Math.min(popoverTop, window.innerHeight - 300));

  return (
    <div className="tour-overlay">
      <div className="tour-highlight" style={style}></div>

      <div
        className="tour-popover animate-pop"
        style={{
          top: popoverTop,
          left: popoverLeft,
        }}
      >
        <div className="tour-step-indicator">
          Step {step + 1} of {steps.length}
        </div>
        <h3 className="tour-title">{steps[step].title}</h3>
        <p className="tour-text">{steps[step].text}</p>

        <div className="tour-footer">
          <button className="btn btn-ghost btn-sm" onClick={onComplete}>
            Skip Tour
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleNext}>
            {step === steps.length - 1 ? "Finish" : "Next"}{" "}
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
