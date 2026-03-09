import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Donor ID is required" },
        { status: 400 }
      );
    }

    await db.bloodDonationRegistration.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting donor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete donor" },
      { status: 500 }
    );
  }
}
