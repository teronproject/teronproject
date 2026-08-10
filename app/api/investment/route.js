import { NextResponse } from "next/server";
import { z } from "zod";
import { sendInvestmentAdminEmail, sendInvestmentUserEmail } from "@/services/email";

const investmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  role: z.string().optional(),
  telegram: z.string().min(2, "Telegram username is required"),
  company: z.string().optional(),
  linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  amount: z.string().min(1, "Please select an investment amount"),
  timeline: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = investmentSchema.parse(body);

    // Send emails in parallel
    const [adminResult, userResult] = await Promise.all([
      sendInvestmentAdminEmail(validatedData),
      sendInvestmentUserEmail(validatedData)
    ]);

    if (!adminResult.success) {
      console.error("Failed to send admin investment email", adminResult.message);
      return NextResponse.json(
        { error: "Failed to submit inquiry. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Inquiry submitted successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Investment API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
