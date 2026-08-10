"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CanvasBackground from "@/components/landing/CanvasBackground";
import { ChartLineData01Icon, MailSend01Icon, CheckmarkBadge01Icon } from "hugeicons-react";

const investmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  telegram: z.string().min(2, "Telegram username is required"),
  amount: z.string().min(1, "Please select an investment amount"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
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
    <div className="min-h-screen flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50">
          <CanvasBackground />
        </div>
        <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="title text-4xl sm:text-5xl font-medium text-white tracking-tight leading-[1.1] mb-5">
            Investment Inquiry
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Interested in backing the future of Teron? Submit an inquiry below and our core team will be in touch to discuss potential partnership and investment opportunities.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 sm:py-24 relative z-10">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8">
          {isSuccess ? (
            <div className="bg-surface-secondary card border border-accent/20 rounded-2xl p-10 text-center flex flex-col items-center">
              <div className="h-16 w-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
                <CheckmarkBadge01Icon size={32} variant="solid" />
              </div>
              <h2 className="text-2xl font-medium text-white mb-3 tracking-tight">Inquiry Submitted!</h2>
              <p className="text-text-secondary mb-8 max-w-md mx-auto">
                Thank you for your interest in Teron. We have received your inquiry and sent a confirmation to your email. Our team will review your application and be in touch shortly.
              </p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl cta font-medium transition-all duration-300"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <div className="bg-surface-secondary card border border-white/5 rounded-2xl p-6 sm:p-10 shadow-2xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">Full Name <span className="text-red-400">*</span></label>
                    <input
                      id="name"
                      type="text"
                      className="w-full bg-surface-tertiary border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-tertiary focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
                      placeholder="Jane Doe"
                      {...register("name")}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">Work Email <span className="text-red-400">*</span></label>
                    <input
                      id="email"
                      type="email"
                      className="w-full bg-surface-tertiary border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-tertiary focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
                      placeholder="jane@company.com"
                      {...register("email")}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Telegram */}
                  <div>
                    <label htmlFor="telegram" className="block text-sm font-medium text-text-primary mb-2">Telegram Username <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-text-tertiary">@</span>
                      </div>
                      <input
                        id="telegram"
                        type="text"
                        className="w-full bg-surface-tertiary border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white placeholder-text-tertiary focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
                        placeholder="username"
                        {...register("telegram")}
                      />
                    </div>
                    {errors.telegram && <p className="text-red-400 text-xs mt-1.5">{errors.telegram.message}</p>}
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-text-primary mb-2">Company / Fund <span className="text-text-tertiary font-normal">(Optional)</span></label>
                    <input
                      id="company"
                      type="text"
                      className="w-full bg-surface-tertiary border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-tertiary focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
                      placeholder="Acme Capital"
                      {...register("company")}
                    />
                    {errors.company && <p className="text-red-400 text-xs mt-1.5">{errors.company.message}</p>}
                  </div>
                </div>

                {/* Investment Amount */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-text-primary mb-2">Intended Investment Amount <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <select
                      id="amount"
                      className="w-full bg-surface-tertiary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors appearance-none"
                      {...register("amount")}
                    >
                      <option value="" disabled>Select an amount range...</option>
                      <option value="$10k - $50k">$10k - $50k</option>
                      <option value="$50k - $100k">$50k - $100k</option>
                      <option value="$100k - $500k">$100k - $500k</option>
                      <option value="$500k+">$500k+</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  {errors.amount && <p className="text-red-400 text-xs mt-1.5">{errors.amount.message}</p>}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">Background & Value Add <span className="text-red-400">*</span></label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full bg-surface-tertiary border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-tertiary focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors resize-y"
                    placeholder="Tell us about yourself, your fund, and how you can bring value to Teron beyond capital..."
                    {...register("message")}
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1.5">{errors.message.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-black font-medium px-6 py-4 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cta"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <MailSend01Icon size={18} variant="solid" />
                    </>
                  )}
                </button>
                
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
