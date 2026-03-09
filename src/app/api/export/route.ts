import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const registrations = await db.bloodDonationRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (registrations.length === 0) {
      return NextResponse.json(
        { success: false, error: "No data to export" },
        { status: 400 }
      );
    }

    // Prepare data for Excel
    const data = registrations.map((reg, index) => ({
      "S.No": index + 1,
      "Name": reg.name,
      "Age": reg.age || "",
      "Mobile Number": reg.mobile,
      "Place": reg.place,
      "Blood Group": reg.bloodGroup || "Unknown",
      "WhatsApp Sent": reg.messageSent ? "Yes" : "No",
      "Registered Date": new Date(reg.createdAt).toLocaleDateString(),
      "Registered Time": new Date(reg.createdAt).toLocaleTimeString(),
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 6 },   // S.No
      { wch: 25 },  // Name
      { wch: 6 },   // Age
      { wch: 15 },  // Mobile Number
      { wch: 20 },  // Place
      { wch: 12 },  // Blood Group
      { wch: 12 },  // WhatsApp Sent
      { wch: 15 },  // Registered Date
      { wch: 12 },  // Registered Time
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Blood Donations");

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Return as downloadable file
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="blood-donations-${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to export data" },
      { status: 500 }
    );
  }
}
