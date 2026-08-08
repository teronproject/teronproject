"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is Teron and how does it work?",
    answer: "Teron is a premium smart contract launchpad built natively for the BNB Smart Chain. It allows you to create, deploy, and verify standard BEP-20 tokens in minutes without writing a single line of code."
  },
  {
    question: "Do I need coding experience to launch a token?",
    answer: "Not at all. Our intuitive dashboard handles all the complex Solidity code, compilation, and blockchain deployment in the background. You just define your token's details and deploy with a single click."
  },
  {
    question: "Are the smart contracts secure and who owns them?",
    answer: "Yes, completely. We use battle-tested, standard OpenZeppelin libraries that are industry-recognized for maximum security. Once deployed, you have 100% exclusive ownership of your contract—we do not have any access to your tokens."
  },
  {
    question: "Why should I verify my contract on BscScan?",
    answer: "Verification publishes your exact source code to BscScan, adding a trusted green checkmark to your contract profile. This transparency is essential for building investor confidence and is usually required to get listed on major exchanges and tracking sites."
  },
  {
    question: "How do I add a logo and social links to my token?",
    answer: "Through our Enterprise suite, we help you publish standardized on-chain metadata. This ensures that decentralized wallets (like Trust Wallet) and DEXs can automatically fetch and display your official logo and project links."
  },
  {
    question: "How much does it cost to use Teron?",
    answer: "Core contract generation and deployment is completely free—you only pay the standard BNB gas fee to the network. Optional premium features like BscScan verification and on-chain metadata cost a small, flat fee paid directly in BNB."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="w-full py-20 relative z-10 border-t border-white/5">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="title text-3xl sm:text-4xl  text-text-primary tracking-tight leading-[1.15] mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Everything you need to know about launching your token with Teron.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white/[0.03] shadow-[0_4px_20px_rgba(0,0,0,0.2)]' : 'hover:bg-white/[0.02]'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full text-left px-6 sm:px-8 py-6 flex items-center justify-between focus:outline-none group"
                >
                  <span className={`text-[16px] font-medium transition-colors ${isOpen ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
                    {faq.question}
                  </span>
                  
                  {/* Premium Morphing Plus/Minus Icon */}
                  <div className="shrink-0 ml-4 relative w-6 h-6 flex items-center justify-center">
                     {/* Horizontal line (always visible, changes color) */}
                     <div className={`absolute w-3.5 h-[1.5px] rounded-full transition-colors duration-300 ${isOpen ? 'bg-accent' : 'bg-text-tertiary group-hover:bg-text-secondary'}`} />
                     {/* Vertical line (rotates and fades out when open) */}
                     <div className={`absolute w-3.5 h-[1.5px] rounded-full transition-all duration-300 ${isOpen ? 'bg-accent rotate-0 opacity-0' : 'bg-text-tertiary group-hover:bg-text-secondary rotate-90 opacity-100'}`} />
                  </div>
                </button>
                
                {/* CSS Grid Animation for smooth height transition */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 sm:px-8 pb-7">
                      <p className="text-[15px] text-text-tertiary leading-relaxed sm:pr-10">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
      <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
    </section>
  );
}
