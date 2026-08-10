"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CanvasBackground from "@/components/landing/CanvasBackground";
import { ChartLineData01Icon, CheckmarkBadge01Icon, ArrowRight01Icon, Shield01Icon, LockKeyIcon, File01Icon } from "hugeicons-react";
import Input from "@/components/ui/Input";
import ErrorState from "@/components/ui/ErrorState";

const investmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  role: z.string().optional(),
  telegram: z.string().min(2, "Telegram username is required"),
  company: z.string().optional(),
  linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  amount: z.string().min(1, "Please select an investment amount"),
  timeline: z.string().optional(),
  message: z.string().min(10, "Please provide more details").max(2000),
});

export default function InvestmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(investmentSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      const response = await fetch("/api/investment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit inquiry");
      }
      
      setIsSuccess(true);
      reset();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-background">
      {/* Hero Section */}
      <section className="relative w-full pt-18 pb-12 sm:pt-24 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <CanvasBackground />
        </div>
        <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start justify-between gap-16 lg:gap-20">
          
          {/* Left Column: Hero Content */}
          <div className="flex-1 max-w-2xl pt-4">
            <h1 className="title text-4xl sm:text-5xl font-medium text-white tracking-tight leading-[1.1] mb-6">
              Invest in the Future of Token Launch Infrastructure
            </h1>
            
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              Teron is pioneering the next generation of decentralized finance tools on the BNB Smart Chain. By simplifying token creation, metadata management, and liquidity deployment, we significantly lower the barrier to entry for legitimate projects while providing robust security features to protect investors.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-secondary border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield01Icon size={16} className="text-text-primary" variant="stroke-rounded" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Infrastructure Focus</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">We build base-layer tools that other protocols rely on. From automated deployments to on-chain verification, Teron is positioned as a foundational layer in the Web3 stack.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-secondary border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <LockKeyIcon size={16} className="text-text-primary" variant="stroke-rounded" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Sustainable Revenue Model</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">Unlike many protocols that rely purely on token inflation, Teron generates real protocol revenue through premium services, smart contract audits, and advanced deployment options.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-secondary border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <File01Icon size={16} className="text-text-primary" variant="stroke-rounded" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Compliance & Transparency</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">We strictly adhere to on-chain best practices. Our smart contracts are rigorously tested, and our deployment architecture is fully transparent and verifiable on BscScan.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Form */}
          <div className="w-full max-w-[600px] shrink-0 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl card">
              
              {isSuccess ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <div className="h-16 w-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
                    <CheckmarkBadge01Icon size={32} variant="solid" />
                  </div>
                  <h2 className="text-2xl font-medium text-white mb-3 tracking-tight">Inquiry Received</h2>
                  <p className="text-text-secondary text-sm mb-8 leading-relaxed">
                    Thank you for your interest in Teron. Our core team reviews all applications carefully and will be in touch with you shortly at the email provided.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="text-accent cta p-3 hover:text-accent-hover font-medium transition-colors"
                  >
                    Submit another inquiry 
                  </button>
                </div>
              ) : (
                <div className="p-8 sm:p-10">
                  <h2 className="text-xl title font-medium text-white mb-8">Submit an Inquiry</h2>
                  
                  {errorMessage ? (
                    <ErrorState 
                      title="Submission Failed" 
                      description={errorMessage} 
                      onRetry={() => setErrorMessage("")}
                      className="mb-6 !py-8 bg-surface-tertiary rounded-xl border border-red-500/10"
                    />
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                          label="Full Name"
                          placeholder="Jane Doe"
                          required
                          {...register("name")}
                          error={errors.name?.message}
                        />
                        <Input
                          label="Work Email"
                          type="email"
                          placeholder="jane@company.com"
                          required
                          {...register("email")}
                          error={errors.email?.message}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                          label="Company / Fund"
                          placeholder="Acme Capital"
                          {...register("company")}
                          error={errors.company?.message}
                        />
                        <Input
                          label="Title / Role"
                          placeholder="Partner"
                          {...register("role")}
                          error={errors.role?.message}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                          label="Telegram Username"
                          placeholder="@username"
                          required
                          {...register("telegram")}
                          error={errors.telegram?.message}
                        />
                        <Input
                          label="LinkedIn Profile"
                          placeholder="https://linkedin.com/..."
                          {...register("linkedin")}
                          error={errors.linkedin?.message}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="input-label">Investment Amount <span className="text-red-500 ml-1">*</span></label>
                          <select
                            className={`input appearance-none ${errors.amount ? "input-error" : ""}`}
                            {...register("amount")}
                          >
                            <option value="" disabled>Select range...</option>
                            <option value="$10k - $50k">$10k - $50k</option>
                            <option value="$50k - $100k">$50k - $100k</option>
                            <option value="$100k - $500k">$100k - $500k</option>
                            <option value="$500k+">$500k+</option>
                          </select>
                          {errors.amount && <p className="input-error-text">{errors.amount.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="input-label">Timeline</label>
                          <select
                            className={`input appearance-none ${errors.timeline ? "input-error" : ""}`}
                            {...register("timeline")}
                          >
                            <option value="" disabled>Select timeline...</option>
                            <option value="Immediate (0-1 months)">Immediate (0-1 months)</option>
                            <option value="Near term (1-3 months)">Near term (1-3 months)</option>
                            <option value="Exploring (3+ months)">Exploring (3+ months)</option>
                          </select>
                          {errors.timeline && <p className="input-error-text">{errors.timeline.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <label className="input-label">Background & Value Add <span className="text-red-500 ml-1">*</span></label>
                        <textarea
                          rows={4}
                          className={`input min-h-[120px] !h-auto resize-none py-3 ${errors.message ? "input-error" : ""}`}
                          placeholder="Tell us about yourself, your fund, and how you can bring value to Teron beyond capital..."
                          {...register("message")}
                        />
                        {errors.message && <p className="input-error-text">{errors.message.message}</p>}
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-black font-medium px-6 py-4 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cta"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <span>Submit Inquiry</span>
                              <ArrowRight01Icon size={18} variant="stroke-rounded" />
                            </>
                          )}
                        </button>
                      </div>
                      
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
      <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
      {/* Post-Form Content */}
      <section className="py-12 border-t border-white/5">
        <div className="max-w- px-4 sm:px-6 lg:px-8 text-left">
          <p className="text-xs text-text-tertiary text-balance leading-relaxed mb-4">
            Teron Protocol operates in strict compliance with data privacy standards. The information provided in this form is transmitted securely and is exclusively used by the core executive team for the purpose of evaluating strategic partnerships and investment opportunities. We do not sell, rent, or distribute your personal or corporate data to any third-party entities.
          </p>
          <p className="text-xs text-text-tertiary text-balance leading-relaxed">
            By submitting this inquiry, you acknowledge that this is not an offer or solicitation of an offer to buy or sell securities. Any potential investment will be subject to appropriate due diligence, legal agreements, and compliance with applicable regulations in your jurisdiction.
          </p>
        </div>
      </section>
      <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
    </div>
  );
}
