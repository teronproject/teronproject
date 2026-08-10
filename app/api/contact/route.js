import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactAdminEmail, sendContactUserEmail } from "@/services/email";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  telegram: z.string().optional(),
  subject: z.string().min(2, "Subject is required").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = contactSchema.parse(body);

    // Send emails in parallel
    const [adminResult, userResult] = await Promise.all([
      sendContactAdminEmail(validatedData),
      sendContactUserEmail(validatedData)
    ]);

    if (!adminResult.success) {
      console.error("Failed to send admin contact email", adminResult.message);
      // We don't necessarily want to fail the whole request if admin email fails, 
      // but usually we do to let the user know their message wasn't delivered.
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
