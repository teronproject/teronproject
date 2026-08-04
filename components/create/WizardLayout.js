"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";

const steps = [
  { id: 1, name: "Token Basics", description: "Name, symbol, and supply" },
  { id: 2, name: "Profile & Socials", description: "Links and community details" },
  { id: 3, name: "Media Assets", description: "Logo and banner images" },
  { id: 4, name: "Review & Deploy", description: "Final check and transaction" },
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
                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                          isComplete
                            ? "bg-accent border-accent"
                            : isCurrent
                            ? "border-accent bg-bg-primary"
                            : "border-border-secondary bg-bg-primary"
                        }`}
                      >
                        {isComplete ? (
                          <svg
                            className="h-5 w-5 text-accent-text"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <span
                            className={`text-sm font-semibold ${
                              isCurrent ? "text-accent" : "text-text-tertiary"
                            }`}
                          >
                            {step.id}
                          </span>
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
        <div className="bg-surface-primary border border-border-primary rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-accent">ℹ️</span>
            <h3 className="font-semibold text-text-primary text-sm">Need Help?</h3>
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
        </div>
      </div>

      {/* Right Content Area: Active Step Form */}
      <div className="lg:col-span-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-surface-secondary border border-border-primary rounded-xl overflow-hidden shadow-sm"
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
