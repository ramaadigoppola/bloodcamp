"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Download,
  LogOut,
  Loader2,
  MessageCircle,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Registration {
  id: string;
  name: string;
  age: number | null;
  mobile: string;
  place: string;
  bloodGroup: string;
  messageSent: boolean;
  thirtySixHrReminder: boolean;
  sixteenHrReminder: boolean;
  createdAt: string;
}

interface AdminStats {
  total: number;
  today: number;
  bloodGroupCounts: Record<string, number>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/registrations");
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations);
        setStats(data.stats);
      }
    } catch {
      console.error("Failed to fetch registrations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/export");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `blood-donations-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Export Complete",
        description: "Excel file downloaded",
      });
    } catch {
      toast({
        title: "Export Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteDonor = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch("/api/delete-donor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (data.success) {
        toast({
          title: "Deleted",
          description: "Donor has been removed",
        });
        fetchRegistrations();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete donor",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSendWhatsApp = async (reg: Registration) => {
    const ageText = reg.age ? `\n• Age: ${reg.age}` : "";
    const bloodGroupText = reg.bloodGroup ? `\n• Blood Group: ${reg.bloodGroup}` : "";
    const message = encodeURIComponent(`✅ *Registration Successful!*

*NRN 74th Birthday - Blood Donation Camp* 🩸

Dear ${reg.name},

Thank you for registering for NRN 74th Birthday - Blood Donation Camp! 

📋 *Registration Details:*
• Name: ${reg.name}${ageText}
• Mobile: ${reg.mobile}
• Place: ${reg.place}${bloodGroupText}

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

_This is an automated message from Blood Donation Camp._`);
    window.open(`https://wa.me/91${reg.mobile}?text=${message}`, '_blank');

    try {
      await fetch("/api/mark-whatsapp-sent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: reg.mobile }),
      });
      fetchRegistrations();
    } catch {
      // Ignore errors
    }
  };

  const handleSendWhatsApp36hrs = async (reg: Registration) => {

    const message = encodeURIComponent(
      "Dear Donor\nThis is a friendly reminder about the Blood Donation Camp on 18th March. Your support can help save lives. We look forward to your valuable participation. Thank you!"
    );

    // For 36hrs reminder, we can use the same message as 16hrs reminder for simplicity

    window.open(`https://wa.me/91${reg.mobile}?text=${message}`, "_blank");

    try {
      await fetch("/api/mark-36hr-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reg.id }),
      });

      fetchRegistrations();

    } catch {
      // ignore errors
    }
  };

  const handleSendWhatsApp16hrs = async (reg: Registration) => {

    const message = encodeURIComponent(
      "Dear Donor\nThis is a friendly reminder about the Blood Donation Camp on 18th March. Your support can help save lives. We look forward to your valuable participation. Thank you!"
    );

    window.open(`https://wa.me/91${reg.mobile}?text=${message}`, "_blank");

    try {
      await fetch("/api/mark-16hr-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reg.id }),
      });

      fetchRegistrations();

    } catch {
      // ignore errors
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src="/logo.jpeg"
                alt="NRN 74th Birthday"
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-lg font-semibold text-slate-900">NRN 74th Birthday - Blood Donation Camp</h1>
              </div>
            </button>

            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <LogOut className="w-4 h-4 mr-1.5" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : (
            <>
              {/* Stats */}
              {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <Card className="border-slate-200">
                    <CardContent className="p-4">
                      <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
                      <p className="text-xs text-slate-500">Total Registrations</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200">
                    <CardContent className="p-4">
                      <p className="text-2xl font-semibold text-slate-900">{stats.today}</p>
                      <p className="text-xs text-slate-500">Today</p>
                    </CardContent>
                  </Card>
                  <Card className="col-span-2 border-slate-200">
                    <CardContent className="p-4">
                      <p className="text-xs text-slate-500 mb-2">Blood Groups</p>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(stats.bloodGroupCounts).length > 0 ? (
                          Object.entries(stats.bloodGroupCounts).map(([group, count]) => (
                            <Badge key={group} variant="secondary" className="text-xs">
                              {group}: {count}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">No data yet</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Registrations Table */}
              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">Registered Donors</CardTitle>
                      <CardDescription>
                        {registrations.length} total registrations
                      </CardDescription>
                    </div>
                    <Button
                      onClick={handleExportExcel}
                      disabled={isExporting || registrations.length === 0}
                      variant="outline"
                      size="sm"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 mr-1.5" />
                          Export Excel
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {registrations.length === 0 ? (
                    <div className="text-center py-10">
                      <Users className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">No registrations yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                      <Table>
                        <TableHeader className="sticky top-0 bg-white">
                          <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead className="text-xs font-medium">Name</TableHead>
                            <TableHead className="text-xs font-medium">Age</TableHead>
                            <TableHead className="text-xs font-medium">Mobile</TableHead>
                            <TableHead className="text-xs font-medium">Place</TableHead>
                            <TableHead className="text-xs font-medium">Blood</TableHead>
                            <TableHead className="text-xs font-medium">WhatsApp</TableHead>
                            <TableHead className="text-xs font-medium">36hrs Reminder</TableHead>
                            <TableHead className="text-xs font-medium">16hrs Reminder</TableHead>
                            <TableHead className="text-xs font-medium">Date</TableHead>
                            <TableHead className="text-xs font-medium">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {registrations.map((reg) => (
                            <TableRow key={reg.id} className="hover:bg-slate-50">
                              <TableCell className="font-medium text-sm">{reg.name}</TableCell>
                              <TableCell className="text-sm text-slate-600">{reg.age || '-'}</TableCell>
                              <TableCell className="text-sm text-slate-600">{reg.mobile}</TableCell>
                              <TableCell className="text-sm text-slate-600">{reg.place}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="text-xs font-medium">
                                  {reg.bloodGroup || 'Unknown'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {reg.messageSent ? (
                                  <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50">
                                    Sent
                                  </Badge>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs bg-green-50 hover:bg-green-100 text-green-700"
                                    onClick={() => void handleSendWhatsApp(reg)}
                                  >
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    Send
                                  </Button>
                                )}
                              </TableCell>
                              <TableCell>
                                {reg.thirtySixHrReminder ? (
                                  <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50">
                                    36hrs Sent
                                  </Badge>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs bg-green-50 hover:bg-green-100 text-green-700"
                                    onClick={() => void handleSendWhatsApp36hrs(reg)}
                                  >
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    36hrs Send
                                  </Button>
                                )}
                              </TableCell>
                              <TableCell>
                                {reg.sixteenHrReminder ? (
                                  <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50">
                                    16hrs Sent
                                  </Badge>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs bg-green-50 hover:bg-green-100 text-green-700"
                                    onClick={() => void handleSendWhatsApp16hrs(reg)}
                                  >
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    16hrs Send
                                  </Button>
                                )}
                              </TableCell>
                              <TableCell className="text-xs text-slate-400">
                                {new Date(reg.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                                  onClick={() => void handleDeleteDonor(reg.id, reg.name)}
                                  disabled={deletingId === reg.id}
                                >
                                  {deletingId === reg.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-3 h-3" />
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.jpeg"
                alt="NRN 74th Birthday"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-sm font-medium">NRN 74th Birthday - Blood Donation Camp</span>
            </div>
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
