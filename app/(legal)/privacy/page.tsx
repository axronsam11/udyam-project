import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 2025</p>
        </div>

        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Data Collection and Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3">Information We Collect</h3>
              <p className="text-gray-700 mb-4">
                This is a demonstration portal. In the actual Udyam Registration portal, 
                the following types of information would be collected:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Personal identification information (Name, Address, Contact details)</li>
                <li>Business identification information (PAN, Aadhaar, Enterprise details)</li>
                <li>Banking and financial information</li>
                <li>Business activity and investment details</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">How We Use Your Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>To process your Udyam registration application</li>
                <li>To verify your business and personal details</li>
                <li>To communicate updates about your application status</li>
                <li>To provide support services</li>
                <li>To comply with legal and regulatory requirements</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Data Security</h3>
              <p className="text-gray-700">
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. Your data 
                is encrypted during transmission and storage.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Demo Portal Notice</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800">
                  <strong>Important:</strong> This is a demonstration portal created for educational 
                  purposes only. No actual data is collected or transmitted to government servers. 
                  All data entered is stored locally in your browser and is automatically deleted 
                  when you close the session.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              <p className="text-gray-700">
                For questions about this privacy policy or the official Udyam Registration process, 
                please contact the Ministry of Micro, Small and Medium Enterprises.
              </p>
            </section>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}