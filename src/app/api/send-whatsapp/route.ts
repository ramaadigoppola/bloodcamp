import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile, name, bloodGroup, reminderType } = body;

    if (!mobile || !name || !bloodGroup) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Format mobile number (remove any non-digit characters and add country code if needed)
    let formattedMobile = mobile.replace(/\D/g, "");
    
    // Add India country code if not present
    if (formattedMobile.length === 10) {
      formattedMobile = "91" + formattedMobile;
    }

    // Default WhatsApp message
    const message = `🩸 *Blood Donation Camp Registration Successful!*

Dear ${name},

Thank you for registering for our Blood Donation Camp! 

📋 *Registration Details:*
• Name: ${name}
• Blood Group: ${bloodGroup}
• Mobile: ${mobile}

🏥 *Important Information:*
• Please bring a valid ID proof
• Have a light meal before donation
• Stay hydrated
• Get adequate sleep the night before

📍 Our team will contact you with the venue and date details.

Together, we can save lives! ❤️

_This is an automated message from Blood Donation Camp._`;

    // Create WhatsApp link
    const whatsappUrl = `https://wa.me/${formattedMobile}?text=${encodeURIComponent(message)}`;

    // In a production environment, you would integrate with a WhatsApp Business API
    // For this demo, we'll just log and return success
    console.log("WhatsApp message to:", formattedMobile);
    console.log("Message:", message);

    // Return the WhatsApp URL for client-side redirect if needed
    return NextResponse.json({
      success: true,
      whatsappUrl,
      message: "WhatsApp message prepared",
    });
  } catch (error) {
    console.error("WhatsApp sending error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send WhatsApp message" },
      { status: 500 }
    );
  }
}
