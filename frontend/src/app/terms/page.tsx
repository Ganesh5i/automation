import Link from "next/link";

export const metadata = {
  title: "Terms of Service - CareerSnap",
  description: "CareerSnap Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card rounded-2xl p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Terms of Service
          </h1>

          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Acceptance of Terms
              </h2>
              <p className="leading-relaxed">
                By using CareerSnap, you agree to these Terms of Service. If you do not
                agree to these terms, please do not use our service. These terms constitute
                a legally binding agreement between you and CareerSnap.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Service Description
              </h2>
              <p className="leading-relaxed">
                CareerSnap provides job listings, internships, company information, and
                Instagram automation for career-related purposes. Our service helps users
                discover employment opportunities and receive job information through
                Instagram Direct Messages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                User Responsibilities
              </h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Provide accurate and truthful information when using our service</li>
                <li>Do not misuse the platform or attempt to exploit any vulnerabilities</li>
                <li>Do not spam or abuse Instagram automation features</li>
                <li>Do not attempt unauthorized access to our systems or data</li>
                <li>Respect the intellectual property rights of CareerSnap and third parties</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Intellectual Property
              </h2>
              <p className="leading-relaxed">
                All CareerSnap branding, logos, website content, software, and other
                intellectual property remain the exclusive property of CareerSnap. You
                may not reproduce, distribute, or create derivative works without our
                express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Third-Party Services
              </h2>
              <p className="leading-relaxed mb-3">
                CareerSnap may integrate with the following third-party services:
              </p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Instagram and Meta platforms</li>
                <li>Supabase for data storage</li>
                <li>Vercel for hosting</li>
                <li>OpenAI or other AI providers for content generation</li>
              </ul>
              <p className="leading-relaxed mt-3">
                By using CareerSnap, you are also subject to the terms and policies of
                these third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Limitation of Liability
              </h2>
              <p className="leading-relaxed">
                CareerSnap is not responsible for employment decisions, job availability,
                or the accuracy of third-party content. We provide job listings and
                information "as is" without warranties of any kind. CareerSnap shall not
                be liable for any indirect, incidental, special, or consequential damages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Privacy
              </h2>
              <p className="leading-relaxed">
                Your use of CareerSnap is also governed by our Privacy Policy. Please
                review our Privacy Policy to understand how we collect, use, and protect
                your information.
              </p>
              <Link
                href="/privacy"
                className="text-primary hover:underline font-medium"
              >
                View Privacy Policy
              </Link>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Data Deletion
              </h2>
              <p className="leading-relaxed">
                You have the right to request deletion of your data associated with
                CareerSnap. Please visit our Data Deletion page for instructions on how
                to submit a deletion request.
              </p>
              <Link
                href="/delete-data"
                className="text-primary hover:underline font-medium"
              >
                View Data Deletion Instructions
              </Link>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Changes to Terms
              </h2>
              <p className="leading-relaxed">
                CareerSnap reserves the right to update these Terms of Service at any
                time. We will notify users of significant changes by posting the new
                terms on our website. Your continued use of the service after such changes
                constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Contact
              </h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms of Service, please contact
                us at:
              </p>
              <a
                href="mailto:ganeshperalam50@gmail.com"
                className="text-primary hover:underline font-medium"
              >
                ganeshperalam50@gmail.com
              </a>
            </section>

            <section className="pt-6 border-t border-border">
              <p className="text-sm">
                Last Updated: July 2026
              </p>
            </section>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
