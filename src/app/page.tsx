"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  CheckCircle2,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function BloodDonationCamp() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    mobile: "",
    place: "",
    bloodGroup: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [knowBloodGroup, setKnowBloodGroup] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.place) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // If user knows blood group, it's mandatory
    if (knowBloodGroup && !formData.bloodGroup) {
      toast({
        title: "Missing Blood Group",
        description: "Please select your blood group",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.success) {
        setIsSuccess(true);
        setFormData({ name: "", age: "", mobile: "", place: "", bloodGroup: "" });
        setKnowBloodGroup(false);
        toast({
          title: "Registration Successful",
          description: "Thank you for registering as a blood donor.",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: data.error || "Please try again",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit registration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.jpeg" 
                alt="NRN 74th Birthday" 
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-lg font-semibold text-slate-900">NRN 74th Birthday - Blood Donation Camp</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Image Section */}
        <section className="relative bg-white py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <img 
                src="/poster.png" 
                alt="NRN 74th Birthday - Blood Donation Camp" 
                className="w-full h-auto object-cover rounded-2xl shadow-xl"
              />
            </motion.div>
          </div>
        </section>

        {/* Registration Section with Background Image */}
        <section 
          className="relative py-16 sm:py-20 lg:py-28"
          style={{
            backgroundImage: `url(/hero-bg2.jpeg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/75 via-slate-900/65 to-slate-900/80" />
          
          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                  One Donation.<br />
                  <span className="text-red-400">Three lives saved.</span>
                </h2>
                <p className="text-slate-300 text-lg max-w-xl mx-auto">
                  Register today and be someone's hero!
                </p>
              </motion.div>
            </div>

            {/* Registration Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-3 text-center">
                  <CardTitle className="text-lg">Register as Donor</CardTitle>
                  <CardDescription>
                    Fill your details below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {isSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="text-center py-4"
                      >
                        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                        </div>
                        <h3 className="text-base font-medium text-slate-900 mb-1">
                          Registration Successful!
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                          Thank you for registering as a blood donor. Your contribution can save lives!
                        </p>
                        
                        <Button
                          onClick={() => {
                            setIsSuccess(false);
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          Register Another Donor
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleFormSubmit}
                        className="space-y-4"
                      >
                        {/* Full Name and Age Section */}
                        <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                          <div className="space-y-1.5">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Enter your name"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="age">Age</Label>
                            <Input
                              id="age"
                              type="number"
                              min="18"
                              max="65"
                              value={formData.age}
                              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                              placeholder="Enter your age"
                            />
                          </div>
                        </div>
                        
                        {/* Mobile and Location Section */}
                        <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                          <div className="space-y-1.5">
                            <Label htmlFor="mobile">WhatsApp Number</Label>
                            <Input
                              id="mobile"
                              type="tel"
                              value={formData.mobile}
                              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                              placeholder="10-digit mobile number"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="place">Location</Label>
                            <Input
                              id="place"
                              value={formData.place}
                              onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                              placeholder="City or area"
                            />
                          </div>
                        </div>
                        
                        {/* Blood Group Toggle Section */}
                        <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <Label 
                              htmlFor="bloodGroupSwitch" 
                              className="cursor-pointer"
                            >
                              Do you know your blood group?
                            </Label>
                            <Switch
                              id="bloodGroupSwitch"
                              checked={knowBloodGroup}
                              onCheckedChange={(checked) => {
                                setKnowBloodGroup(checked);
                                if (!checked) {
                                  setFormData({ ...formData, bloodGroup: "" });
                                }
                              }}
                              className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-400"
                            />
                          </div>
                          
                          {/* Blood Group Dropdown - Only show if switch is on */}
                          {knowBloodGroup && (
                            <div className="space-y-1.5">
                              <Label htmlFor="bloodGroup">Blood Group <span className="text-red-500">*</span></Label>
                              <Select
                                value={formData.bloodGroup}
                                onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
                              >
                                <SelectTrigger className={!formData.bloodGroup ? 'border-red-300' : ''}>
                                  <SelectValue placeholder="Select blood group" />
                                </SelectTrigger>
                                <SelectContent>
                                  {BLOOD_GROUPS.map((group) => (
                                    <SelectItem key={group} value={group}>
                                      {group}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          type="submit"
                          className="w-full bg-red-500 hover:bg-red-600 mt-2 h-12 font-bold"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Registering...
                            </>
                          ) : (
                            <>
                              Submit
                              <ArrowRight className="w-4 h-4 ml-1.5" />
                            </>
                          )}
                        </Button>
                        
                        {/* Footnote */}
                        <p className="text-xs text-slate-500 text-center mt-3">
                          Upon submission, a confirmation message shall be sent to you via WhatsApp.
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.jpeg" 
                alt="NRN 74th Birthday" 
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <span className="text-sm font-medium">NRN 74th Birthday - Blood Donation Camp</span>
                <p className="text-xs text-slate-400">A drop of blood, a lifetime of hope!</p>
              </div>
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
