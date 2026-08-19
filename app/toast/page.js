"use client";

import { useToastContext } from "@/components/ToastProvider";

export default function ToastTestPage() {
  const { addToast } = useToastContext();

  const handleShowToast = (variant) => {
    let message = "";
    if (variant === "info") message = "This is a general update with useful info.";
    if (variant === "success") message = "Everything went through successfully.";
    if (variant === "warning") message = "Something might need your attention.";
    if (variant === "error") message = "Please try again in a moment.";

    addToast({
      variant,
      message,
    });
  };

  const handleShowCustomToast = () => {
    addToast({
      variant: "success",
      title: "Contract Deployed",
      message: "Your smart contract was deployed on Binance Smart Chain.",
    });
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-bg-secondary border border-border-primary rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-2">Toast Testing</h1>
        <p className="text-text-secondary mb-8">
          Click the buttons below to test the new toast notifications.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleShowToast("info")}
            className="w-full py-3 px-4 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-xl font-medium transition-colors text-left"
          >
            Show Info Toast
          </button>
          
          <button
            onClick={() => handleShowToast("success")}
            className="w-full py-3 px-4 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-xl font-medium transition-colors text-left"
          >
            Show Success Toast
          </button>
          
          <button
            onClick={() => handleShowToast("warning")}
            className="w-full py-3 px-4 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-xl font-medium transition-colors text-left"
          >
            Show Warning Toast
          </button>
          
          <button
            onClick={() => handleShowToast("error")}
            className="w-full py-3 px-4 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-medium transition-colors text-left"
          >
            Show Error Toast (Shake)
          </button>

          <hr className="border-border-primary my-4" />

          <button
            onClick={handleShowCustomToast}
            className="w-full py-3 px-4 bg-bg-primary border border-border-primary hover:bg-bg-tertiary rounded-xl font-medium transition-colors text-left"
          >
            Show Custom Title Toast
          </button>
        </div>
      </div>
    </div>
  );
}
