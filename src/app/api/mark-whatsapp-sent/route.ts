import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile } = body;

    if (!mobile) {
      return NextResponse.json(
        { success: false, error: "Mobile number is required" },
        { status: 400 }
      );
    }

    const cleanMobile = mobile.replace(/\D/g, "");
    
    const registration = await db.bloodDonationRegistration.findFirst({
      where: { mobile: cleanMobile },
    });

    if (registration) {
      await db.bloodDonationRegistration.update({
        where: { id: registration.id },
        data: { messageSent: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking WhatsApp sent:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update status" },
      { status: 500 }
    );
  }
}
