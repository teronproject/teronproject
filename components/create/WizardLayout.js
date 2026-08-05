"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import { 
  CheckmarkBadge01Icon, 
  InformationCircleIcon, 
  Settings01Icon,
  CrownIcon,
  Rocket01Icon
} from "hugeicons-react";

const steps = [
  { id: 1, name: "Token Basics", description: "Name, symbol, and supply", icon: Settings01Icon },
  { id: 2, name: "Premium Add-ons", description: "Verification and visibility", icon: CrownIcon },
  { id: 3, name: "Review & Deploy", description: "Final check and transaction", icon: Rocket01Icon },
];

/**
 * Wrapper for the Token Creation Wizard with progress tracker and rich content layout.
 */
export default function WizardLayout({
  currentStep,
  title,
  description,
  children,
  onNext,
  onBack,
  isNextDisabled = false,
  isNextLoading = false,
  nextLabel = "Continue",
}) {
  return (
    <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Sidebar: Progress Tracker & Heavy Context */}
      <div className="lg:col-span-4 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Deploy Token</h1>
          <p className="text-text-secondary text-sm">
            Launch your BEP-20 token on BNB Chain in minutes. No coding required.
          </p>
        </div>

        {/* Progress Stepper */}
        <nav aria-label="Progress">
          <ol role="list" className="space-y-6">
            {steps.map((step) => {
              const isComplete = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <li key={step.id}>
                  <div className="group relative flex items-start">
                    <span className="flex h-9 items-center">
                      <span
                        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-sm transition-all duration-300 ${
                          isComplete
                            ? "bg-accent border-accent text-accent-text"
                            : isCurrent
                            ? "border-accent bg-accent/10 text-accent shadow-[0_0_15px_rgba(var(--color-accent),0.3)]"
                            : "border-border-secondary bg-surface-secondary text-text-disabled"
                        }`}
                      >
                        {isComplete ? (
                          <CheckmarkBadge01Icon variant="solid" size={20} />
                        ) : (
                          <step.icon variant={isCurrent ? "solid" : "stroke-rounded"} size={20} />
                        )}
                      </span>
                    </span>
                    <span className="ml-4 flex min-w-0 flex-col">
                      <span
                        className={`text-sm font-semibold tracking-wide uppercase ${
                          isCurrent ? "text-accent" : "text-text-primary"
                        }`}
                      >
                        {step.name}
                      </span>
                      <span className="text-sm text-text-tertiary">
                        {step.description}
                      </span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Contextual Help Box */}
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          key={`help-${currentStep}`}
          className="bg-accent/5 border border-accent/20 rounded-xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <InformationCircleIcon variant="solid" className="text-accent" size={20} />
            <h3 className="font-semibold text-accent text-sm tracking-wide uppercase">Need Help?</h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {currentStep === 1 &&
              "Choose a unique name and symbol. The total supply defines how many tokens will ever exist. Standard tokens usually have 18 decimals."}
            {currentStep === 2 &&
              "A strong profile builds trust. Provide clear descriptions and link your official social channels so investors can find you."}
            {currentStep === 3 &&
              "High-quality imagery makes your token stand out on the leaderboard. Upload a clear, square logo and an engaging banner."}
            {currentStep === 4 &&
              "Review all details carefully. Once deployed to the blockchain, basic contract parameters cannot be changed."}
          </p>
        </motion.div>
      </div>

      {/* Right Content Area: Active Step Form */}
      <div className="lg:col-span-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-surface-secondary border border-border-primary rounded-2xl overflow-hidden shadow-xl shadow-black/5"
        >
          {/* Step Header */}
          <div className="px-8 py-6 border-b border-border-primary bg-surface-primary">
            <h2 className="text-xl font-bold text-text-primary">{title}</h2>
            {description && (
              <p className="mt-2 text-sm text-text-secondary">{description}</p>
            )}
          </div>

          {/* Step Body */}
          <div className="p-8">{children}</div>

          {/* Step Footer / Actions */}
          <div className="px-8 py-5 border-t border-border-primary bg-surface-primary flex items-center justify-between">
            {onBack ? (
              <Button variant="ghost" onClick={onBack} disabled={isNextLoading}>
                Back
              </Button>
            ) : (
              <div /> // Spacer
            )}

            <Button
              variant="primary"
              onClick={onNext}
              disabled={isNextDisabled || isNextLoading}
              isLoading={isNextLoading}
            >
              {nextLabel}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
