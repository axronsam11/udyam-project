"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReviewTable } from "@/components/forms/ReviewTable";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { MockDataClient } from "@/lib/data/MockDataClient";
import { ArrowLeft, Edit, FileCheck, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const dataClient = new MockDataClient();

interface FormSection {
  title: string;
  fields: Array<{ label: string; value: string; key: string }>;
  isComplete: boolean;
}

export default function ReviewPage() {
  const [formData, setFormData] = useState<any>(null);
  const [sections, setSections] = useState<FormSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const data = await dataClient.loadDraft();
      if (!data) {
        router.push('/register');
        return;
      }
      
      setFormData(data);
      
      // Process form data into sections
      const processedSections = processFormDataIntoSections(data);
      setSections(processedSections);
    } catch (error) {
      console.error('Failed to load form data:', error);
      toast.error('Failed to load form data');
    } finally {
      setIsLoading(false);
    }
  };

  const processFormDataIntoSections = (data: any): FormSection[] => {
    // Mock processing - in real app, this would use the schema
    return [
      {
        title: "Applicant Details",
        isComplete: true,
        fields: [
          { label: "Full Name", value: data.fullName || "Not provided", key: "fullName" },
          { label: "PAN Number", value: data.panNumber || "Not provided", key: "panNumber" },
          { label: "Aadhaar Number", value: data.aadhaarNumber ? `****-****-${data.aadhaarNumber.slice(-4)}` : "Not provided", key: "aadhaarNumber" },
          { label: "Email", value: data.email || "Not provided", key: "email" },
          { label: "Mobile Number", value: data.mobileNumber || "Not provided", key: "mobileNumber" }
        ]
      },
      {
        title: "Enterprise Details", 
        isComplete: true,
        fields: [
          { label: "Enterprise Name", value: data.enterpriseName || "Not provided", key: "enterpriseName" },
          { label: "Enterprise Type", value: data.enterpriseType || "Not provided", key: "enterpriseType" },
          { label: "Date of Commencement", value: data.commencementDate || "Not provided", key: "commencementDate" }
        ]
      },
      {
        title: "Location Details",
        isComplete: !!(data.pinCode && data.state && data.district),
        fields: [
          { label: "PIN Code", value: data.pinCode || "Not provided", key: "pinCode" },
          { label: "State", value: data.state || "Not provided", key: "state" },
          { label: "District", value: data.district || "Not provided", key: "district" },
          { label: "Address", value: data.address || "Not provided", key: "address" }
        ]
      },
      {
        title: "Bank Details",
        isComplete: !!(data.ifscCode && data.bankName),
        fields: [
          { label: "IFSC Code", value: data.ifscCode || "Not provided", key: "ifscCode" },
          { label: "Bank Name", value: data.bankName || "Not provided", key: "bankName" },
          { label: "Branch", value: data.branchName || "Not provided", key: "branchName" },
          { label: "Account Number", value: data.accountNumber ? `****${data.accountNumber.slice(-4)}` : "Not provided", key: "accountNumber" }
        ]
      }
    ];
  };

  const handleSubmit = async () => {
    if (!formData) return;

    setIsSubmitting(true);
    
    try {
      const result = await dataClient.submit(formData);
      toast.success('Application submitted successfully!');
      
      // Clear form data after successful submission
      localStorage.removeItem('udyam_draft');
      
      router.push(`/success?ref=${result.reference}`);
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCompletionStats = () => {
    const completed = sections.filter(s => s.isComplete).length;
    const total = sections.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const stats = getCompletionStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Review Application
              </h1>
              <p className="text-gray-600">
                Review your details before submitting your Udyam registration
              </p>
            </div>
            
            <div className="text-right">
              <div className="mb-2">
                <Badge variant={stats.completed === stats.total ? "default" : "secondary"}>
                  {stats.completed}/{stats.total} Complete
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                {stats.percentage}% Complete
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-8">
          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-green-600" />
                  Application Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
                    <div className="text-sm text-gray-600">Sections Complete</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.total - stats.completed}</div>
                    <div className="text-sm text-gray-600">Pending Sections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.percentage}%</div>
                    <div className="text-sm text-gray-600">Overall Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Review Sections */}
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 2) }}
            >
              <Card className="rounded-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {section.title}
                      <Badge variant={section.isComplete ? "default" : "secondary"}>
                        {section.isComplete ? "Complete" : "Incomplete"}
                      </Badge>
                    </CardTitle>
                    <Link href="/register">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <ReviewTable fields={section.fields} />
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <Link href="/register">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Edit
                    </Button>
                  </Link>
                  
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || stats.completed !== stats.total}
                    className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
                
                {stats.completed !== stats.total && (
                  <p className="text-sm text-amber-600 mt-4 text-center">
                    Please complete all sections before submitting your application.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}