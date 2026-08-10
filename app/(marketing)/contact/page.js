"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CanvasBackground from "@/components/landing/CanvasBackground";
import { MailSend01Icon, CheckmarkBadge01Icon, LifebuoyIcon, Message01Icon, News01Icon } from "hugeicons-react";
import Input from "@/components/ui/Input";
import ErrorState from "@/components/ui/ErrorState";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  telegram: z.string().optional(),
  subject: z.string().min(2, "Subject is required").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
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
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full pt-18 pb-12 sm:pt-24 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <CanvasBackground />
        </div>
        <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start justify-between gap-16 lg:gap-20">
          
          {/* Left Column: Hero Content */}
          <div className="flex-1 max-w-2xl pt-4">
            <h1 className="title text-4xl sm:text-5xl font-medium text-white tracking-tight leading-[1.1] mb-6">
              Get in Touch with Teron
            </h1>
            
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              Whether you need technical support for a token deployment, have questions about the Teron ecosystem, or want to explore integrations, our team is here to help you navigate the platform.
            </p>
            
            <div className="space-y-6 mt-10">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-secondary border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <LifebuoyIcon size={16} className="text-text-primary" variant="stroke-rounded" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Technical Support</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">Assistance with smart contract deployments, metadata management, and troubleshooting dashboard features.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-secondary border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <Message01Icon size={16} className="text-text-primary" variant="stroke-rounded" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">General Inquiries</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">Questions regarding platform fees, roadmap timelines, or how the TERR reward system functions.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-secondary border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <News01Icon size={16} className="text-text-primary" variant="stroke-rounded" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Media & Press</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">Reach out for interviews, brand asset requests, or official statements from the Teron executive team.</p>
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
                  <h2 className="text-2xl font-medium text-white mb-3 tracking-tight">Message Sent!</h2>
                  <p className="text-text-secondary text-sm mb-8 leading-relaxed">
                    Thank you for reaching out. We have received your message and sent a confirmation to your email. Our team typically responds within 24-48 hours.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="text-accent cta p-3 hover:text-accent-hover font-medium transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <div className="p-8 sm:p-10">
                  <h2 className="text-xl title font-medium text-white mb-8">Send a Message</h2>
                  
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
                          label="Email Address"
                          type="email"
                          placeholder="jane@example.com"
                          required
                          {...register("email")}
                          error={errors.email?.message}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                          label="Telegram Username"
                          placeholder="@username"
                          {...register("telegram")}
                          error={errors.telegram?.message}
                        />
                        <Input
                          label="Subject"
                          placeholder="How can we help?"
                          required
                          {...register("subject")}
                          error={errors.subject?.message}
                        />
                      </div>

                      <div className="space-y-2 pt-1">
                        <label className="input-label">Message <span className="text-red-500 ml-1">*</span></label>
                        <textarea
                          rows={5}
                          className={`input min-h-[120px] !h-auto resize-none py-3 ${errors.message ? "input-error" : ""}`}
                          placeholder="Type your message here..."
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
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <span>Send Message</span>
                              <MailSend01Icon size={18} variant="solid" />
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
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <p className="text-xs text-text-tertiary text-balance leading-relaxed mb-4">
            Teron values your privacy. By submitting this form, you consent to having Teron collect your email and name so that we can reply to your message. We strictly adhere to data protection standards and will not use your personal information for unauthorized marketing or share it with third parties.
          </p>
          <p className="text-xs text-text-tertiary text-balance leading-relaxed">
            For urgent technical support regarding a deployed contract, please include the contract address and transaction hash in your message to expedite our review process.
          </p>
        </div>
      </section>

      <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
    </div>
  );
}
