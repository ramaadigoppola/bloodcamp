import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {

  const { id } = await req.json();

  await db.bloodDonationRegistration.update({
    where: { id },
    data: {
      sixteenHrReminder: true
    }
  });

  return NextResponse.json({ success: true });

}