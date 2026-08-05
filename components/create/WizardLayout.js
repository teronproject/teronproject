"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { 
  CheckmarkCircle03Icon, 
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
          <h1 className="text-2xl title text-text-primary mb-2">Deploy Token</h1>
          <p className="text-text-tertiary text-xs text-balance">
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
                        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-sm transition-all duration-300 card ${
                          isComplete
                            ? "text-green-600"
                            : isCurrent
                            ? "border-accent bg-accent/10 text-accent shadow-[0_0_15px_rgba(var(--color-accent),0.3)]"
                            : "border-border-secondary bg-surface-secondary text-text-disabled"
                        }`}
                      >
                        {isComplete ? (
                          <CheckmarkCircle03Icon variant="solid" size={20} />
                        ) : (
                          <step.icon variant={isCurrent ? "solid" : "stroke-rounded"} size={20} />
                        )}
                      </span>
                    </span>
                    <span className="ml-4 flex min-w-0 flex-col">
                      <span
                        className={`text-sm mb-0.5 font-semibold title ${
                          isCurrent ? "text-accent" : "text-text-secondary"
                        }`}
                      >
                        {step.name}
                      </span>
                      <span className="text-xs text-text-tertiary">
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
          className="bg-accent/5 border border-accent/20 rounded-xl p-5 shadow-sm card"
        >
          <div className="flex items-center gap-2 mb-3">
            <InformationCircleIcon variant="solid" className="text-accent" size={20} />
            <h3 className="font-semibold title text-accent text-sm">Need Help?</h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {currentStep === 1 &&
              "Choose a unique name and symbol. The total supply defines how many tokens will ever exist. Standard tokens usually have 18 decimals."}
            {currentStep === 2 &&
              "Select optional premium services. Contract Verification publishes your source code on BscScan. On-Chain Metadata makes your logo visible in wallets."}
            {currentStep === 3 &&
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
        >
          <Card className="shadow-2xl">
            {/* Step Header */}
            <Card.Header>
              <h2 className="text-xl font-bold title text-text-primary">{title}</h2>
              {description && (
                <p className="mt-1.5 text-xs stitle text-text-secondary">{description}</p>
              )}
            </Card.Header>

            {/* Step Body */}
            <Card.Body className="p-8">
              {children}
            </Card.Body>

            {/* Step Footer / Actions */}
            <Card.Footer className="flex items-center justify-between bg-surface-primary/30">
              {onBack ? (
                <Button variant="secondary" onClick={onBack} disabled={isNextLoading} className="card text-white cursor-pointer">
                  Back
                </Button>
              ) : (
                <div /> // Spacer
              )}
              
              <Button onClick={onNext} isLoading={isNextLoading} disabled={isNextDisabled} className="cta">
                {nextLabel}
              </Button>
            </Card.Footer>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
