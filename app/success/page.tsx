"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, Home, Mail, Phone, Share2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const referenceNumber = searchParams.get('ref') || 'UR2025001234';
  const [applicationDate] = useState(new Date().toLocaleDateString('en-IN'));

  const handleCopyReference = () => {
    navigator.clipboard.writeText(referenceNumber);
    toast.success('Reference number copied to clipboard');
  };

  const handleDownloadAcknowledgment = () => {
    // Mock download - in real app, this would generate a PDF
    toast.info('PDF download feature will be available in the full version');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Udyam Registration Success',
        text: `My Udyam registration has been submitted successfully. Reference: ${referenceNumber}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`Reference: ${referenceNumber}`);
      toast.success('Reference number copied to clipboard');
    }
  };

  const nextSteps = [
    {
      title: "Application Processing",
      description: "Your application will be processed within 7-10 business days.",
      timeline: "Within 7-10 days"
    },
    {
      title: "Verification",
      description: "Documents and details will be verified by the concerned authorities.",
      timeline: "Day 3-7"
    },
    {
      title: "Certificate Generation", 
      description: "Upon successful verification, your Udyam certificate will be generated.",
      timeline: "Day 7-10"
    },
    {
      title: "Certificate Delivery",
      description: "The certificate will be sent to your registered email address.",
      timeline: "Day 10+"
    }
  ];

  const benefits = [
    "Priority in Government tenders",
    "Easy access to credit and loans",
    "Subsidies on various schemes",
    "Protection against delayed payments",
    "Technology upgradation support",
    "Marketing assistance programs"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Success Header */}
      <section className="px-4 pt-16 pb-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Application Submitted Successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your Udyam registration application has been submitted and is being processed.
            </p>
            <Badge variant="outline" className="text-lg px-6 py-2 bg-green-50 border-green-200 text-green-800">
              Application Status: Submitted
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Reference Details */}
      <section className="px-4 pb-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="rounded-2xl shadow-lg border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-center text-xl">Application Reference Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="mb-2 text-sm font-medium text-gray-600">Reference Number</div>
                  <div className="mb-4 text-2xl font-mono font-bold text-gray-900 tracking-wider">
                    {referenceNumber}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyReference}
                    className="mb-4"
                  >
                    Copy Reference Number
                  </Button>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-1">Submission Date</div>
                    <div className="font-semibold">{applicationDate}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-1">Expected Processing</div>
                    <div className="font-semibold">7-10 Business Days</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" onClick={handleDownloadAcknowledgment}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Acknowledgment
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="px-4 pb-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {nextSteps.map((step, index) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{step.title}</h3>
                            <p className="text-sm text-gray-600">{step.description}</p>
                          </div>
                          <Badge variant="secondary" className="mt-2 sm:mt-0 w-fit">
                            {step.timeline}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 pb-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Benefits of Udyam Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="px-4 pb-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="rounded-2xl shadow-lg bg-blue-50/50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">Email Support</div>
                      <div className="text-sm text-gray-600">support@udyamregistration.gov.in</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">Helpline</div>
                      <div className="text-sm text-gray-600">1800-11-6000</div>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-600">
                  For any queries regarding your application status, please quote your reference number: <strong>{referenceNumber}</strong>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Actions */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/">
              <Button className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white px-8 py-3 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Home className="mr-2 h-5 w-5" />
                Return to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading success page...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}