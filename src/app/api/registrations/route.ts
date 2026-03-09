import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const registrations = await db.bloodDonationRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Calculate stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRegistrations = registrations.filter(
      (r) => new Date(r.createdAt) >= today
    );

    // Blood group counts
    const bloodGroupCounts: Record<string, number> = {};
    for (const reg of registrations) {
      bloodGroupCounts[reg.bloodGroup] = (bloodGroupCounts[reg.bloodGroup] || 0) + 1;
    }

    return NextResponse.json({
      success: true,
      registrations,
      stats: {
        total: registrations.length,
        today: todayRegistrations.length,
        bloodGroupCounts,
      },
    });
  } catch (error) {
    console.error("Fetch registrations error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
