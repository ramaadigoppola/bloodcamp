import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, age, mobile, place, bloodGroup } = body;

    // Validate input
    if (!name || !mobile || !place) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate mobile number format (basic validation)
    const mobileRegex = /^[0-9]{10}$/;
    const cleanMobile = mobile.replace(/\D/g, "");
    if (!mobileRegex.test(cleanMobile)) {
      return NextResponse.json(
        { success: false, error: "Invalid mobile number format. Please enter a 10-digit number." },
        { status: 400 }
      );
    }

    // Check if mobile already exists
    const existingRegistration = await db.bloodDonationRegistration.findFirst({
      where: { mobile: cleanMobile },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { 
          success: false, 
          error: "This mobile number is already registered. Each phone number can only register once." 
        },
        { status: 400 }
      );
    }

    // Create registration
    const registration = await db.bloodDonationRegistration.create({
      data: {
        name: name.trim(),
        age: age ? parseInt(age) : null,
        mobile: cleanMobile,
        place: place.trim(),
        bloodGroup: bloodGroup || null,
        messageSent: false,
      },
    });

    // Generate WhatsApp message and link
    const formattedMobile = "91" + cleanMobile;
    const ageText = age ? `\n• Age: ${age}` : "";
    const bloodGroupText = bloodGroup ? `\n• Blood Group: ${bloodGroup}` : "";
    const whatsappMessage = `✅ *Registration Successful!*

*NRN 74th Birthday - Blood Donation Camp* 🩸

Dear ${name},

Thank you for registering for NRN 74th Birthday - Blood Donation Camp! 

📋 *Registration Details:*
• Name: ${name}${ageText}
• Mobile: ${cleanMobile}
• Place: ${place}${bloodGroupText}

🏥 *Important Information:*
• Please bring a valid ID proof
• Have a light meal before donation
• Stay hydrated
• Get adequate sleep the night before
• Don't take alcohol 24hrs before Blood Donation

📅 Date: *18th March 2026*
📍 Place: *Naravaripalli*


🔗 *Location Link:*
 https://maps.app.goo.gl/xUtsa2LehgfHDsnWA


A drop of blood, a lifetime of hope! ❤️

_This is an automated message from Blood Donation Camp._`;

    const whatsappUrl = `https://wa.me/${formattedMobile}?text=${encodeURIComponent(whatsappMessage)}`;

    return NextResponse.json({
      success: true,
      data: registration,
      whatsappUrl,
      whatsappMessage,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register. Please try again." },
      { status: 500 }
    );
  }
}
