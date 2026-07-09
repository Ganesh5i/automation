import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - CareerSnap",
  description: "CareerSnap Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card rounded-2xl p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Overview
              </h2>
              <p className="leading-relaxed">
                CareerSnap uses the Instagram and Meta APIs to respond to comments
                and send requested job information through Instagram Direct Messages.
                Our service is designed to help users find job opportunities quickly
                and efficiently.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Data Usage
              </h2>
              <p className="leading-relaxed">
                User information is only used for providing the requested service.
                When you interact with CareerSnap through Instagram, we may collect
                and process information necessary to deliver job listings and respond
                to your inquiries.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Data Sharing
              </h2>
              <p className="leading-relaxed">
                CareerSnap does not sell or share personal data with third parties
                except when required by law. We are committed to protecting your
                privacy and maintaining the confidentiality of your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Data Retention
              </h2>
              <p className="leading-relaxed">
                We retain user data only as long as necessary to provide our services
                and as required by applicable laws. You may request deletion of your
                data at any time by following the instructions in our Data Deletion
                page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Contact
              </h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us at:
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
                Last updated: July 2026
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
