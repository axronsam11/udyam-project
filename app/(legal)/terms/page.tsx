import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 2025</p>
        </div>

        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3">Acceptance of Terms</h3>
              <p className="text-gray-700">
                By accessing and using this demonstration portal, you acknowledge that you understand 
                this is not the official Udyam Registration portal and agree to these terms and conditions.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Demonstration Portal</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  <strong>Important Notice:</strong> This is a demonstration portal created for 
                  educational and showcase purposes only. No actual Udyam registrations will be 
                  processed through this portal. For official registrations, please visit 
                  <a href="https://udyamregistration.gov.in" className="underline ml-1" target="_blank" rel="noopener noreferrer">
                    udyamregistration.gov.in
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Accuracy of Information</h3>
              <p className="text-gray-700">
                While we strive to provide accurate information about the Udyam registration process, 
                this demonstration may not reflect the most current requirements or procedures. 
                Always refer to the official government portal for the latest information.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Data Handling</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>All data entered is stored locally in your browser only</li>
                <li>No information is transmitted to external servers</li>
                <li>Data is automatically cleared when you close the browser session</li>
                <li>Do not enter real personal or business information</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Limitation of Liability</h3>
              <p className="text-gray-700">
                This demonstration portal is provided "as is" without any warranties. We are not 
                liable for any decisions made based on the information or experience provided by 
                this demonstration.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Official Registration</h3>
              <p className="text-gray-700">
                For actual Udyam registration, please visit the official government portal at 
                udyamregistration.gov.in. Only registrations completed through the official portal 
                are valid and recognized by the Government of India.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Contact</h3>
              <p className="text-gray-700">
                This demonstration portal is created for educational purposes. For questions about 
                the official Udyam Registration process, please contact the Ministry of Micro, 
                Small and Medium Enterprises through their official channels.
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