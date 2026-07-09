import Link from "next/link";

export const metadata = {
  title: "Data Deletion Instructions - CareerSnap",
  description: "Instructions for requesting data deletion from CareerSnap",
};

export default function DeleteDataPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card rounded-2xl p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Data Deletion Instructions
          </h1>

          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Requesting Data Deletion
              </h2>
              <p className="leading-relaxed">
                If you wish to delete your data associated with CareerSnap, you can
                send an email to:
              </p>
              <a
                href="mailto:ganeshperalam50@gmail.com"
                className="text-primary hover:underline font-medium text-lg"
              >
                ganeshperalam50@gmail.com
              </a>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Required Information
              </h2>
              <p className="leading-relaxed">
                Please include your Instagram username in the request to help us
                identify your account and associated data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Verification Process
              </h2>
              <p className="leading-relaxed">
                Once we receive your request, we will verify your identity through
                your Instagram username. This verification step is necessary to
                ensure that data deletion requests are authorized by the account
                holder.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Data Removal
              </h2>
              <p className="leading-relaxed">
                After verification, all associated stored data will be removed from
                our systems. This includes any information collected through your
                interactions with CareerSnap via Instagram.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Processing Time
              </h2>
              <p className="leading-relaxed">
                We aim to process data deletion requests within a reasonable timeframe,
                typically within 7-10 business days. You will receive a confirmation
                email once your data has been deleted.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Contact
              </h2>
              <p className="leading-relaxed">
                If you have any questions about the data deletion process or need
                assistance with your request, please contact us at:
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
