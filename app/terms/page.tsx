import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/login">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Button>
        </Link>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl">Terms of Service</CardTitle>
            </div>
            <p className="text-muted-foreground">Last updated: January 2025</p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using the Government of Jamaica Citizen Services Platform, you accept and agree to be
                bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do
                not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Use License</h2>
              <p className="text-muted-foreground leading-relaxed">
                Permission is granted to temporarily access the materials (information or software) on the Government of
                Jamaica's platform for personal, non-commercial transitory viewing only. This is the grant of a license,
                not a transfer of title.
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-muted-foreground">
                <li>You may not modify or copy the materials</li>
                <li>You may not use the materials for any commercial purpose</li>
                <li>You may not attempt to decompile or reverse engineer any software</li>
                <li>You may not remove any copyright or other proprietary notations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. User Account</h2>
              <p className="text-muted-foreground leading-relaxed">
                To access certain features of the platform, you must register for an account. You are responsible for
                maintaining the confidentiality of your account credentials and for all activities that occur under your
                account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Data Accuracy</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to provide accurate, current, and complete information during registration and in all
                applications submitted through the platform. Providing false information may result in account
                termination and legal consequences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Privacy and Data Protection</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your use of the platform is also governed by our Privacy Policy. We collect and process personal data in
                accordance with Jamaica's Data Protection Act and other applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Service Availability</h2>
              <p className="text-muted-foreground leading-relaxed">
                We strive to maintain continuous service availability but do not guarantee uninterrupted access. The
                platform may be temporarily unavailable due to maintenance, updates, or circumstances beyond our
                control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Prohibited Activities</h2>
              <p className="text-muted-foreground leading-relaxed">You agree not to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-muted-foreground">
                <li>Use the platform for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to any portion of the platform</li>
                <li>Interfere with or disrupt the platform or servers</li>
                <li>Submit false or misleading information</li>
                <li>Harass, abuse, or harm other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content on this platform, including text, graphics, logos, and software, is the property of the
                Government of Jamaica and is protected by copyright and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Government of Jamaica shall not be liable for any damages arising from the use or inability to use
                the platform, including but not limited to direct, indirect, incidental, or consequential damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use of the platform after changes
                constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-3 p-4 bg-muted rounded-lg">
                <p className="font-medium">Government of Jamaica</p>
                <p className="text-muted-foreground">Citizen Services Division</p>
                <p className="text-muted-foreground">Email: support@gov.jm</p>
                <p className="text-muted-foreground">Phone: 1-888-GOVT-JAM</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
