import { Metadata } from "next";
import { HomeFooter } from "@/components/home/footer";
import { HomeNavigation } from "@/components/home/navigation";

export const metadata: Metadata = {
  title: "Terms of Service | Kawane Studio",
  description: "Terms of Service for Kawane Studio",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeNavigation />
      <main className="flex-1 bg-gray-50 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
              Terms of Service
            </h1>

            <div className="prose prose-sm md:prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  By accessing and using Kawane Studio's services, you accept
                  and agree to be bound by the terms and provision of this
                  agreement. If you do not agree to abide by the above, please
                  do not use this service.
                </p>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  2. Use License
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                  Permission is granted to temporarily download one copy of the
                  materials on Kawane Studio's website for personal,
                  non-commercial transitory viewing only. This is the grant of a
                  license, not a transfer of title, and under this license you
                  may not:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 md:space-y-2 ml-4 text-sm md:text-base">
                  <li>modify or copy the materials</li>
                  <li>
                    use the materials for any commercial purpose or for any
                    public display
                  </li>
                  <li>
                    attempt to reverse engineer any software contained on the
                    website
                  </li>
                  <li>
                    remove any copyright or other proprietary notations from the
                    materials
                  </li>
                </ul>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  3. User Accounts
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  When you create an account with us, you must provide
                  information that is accurate, complete, and current at all
                  times. You are responsible for safeguarding the password and
                  for all activities that occur under your account.
                </p>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  4. Privacy Policy
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  Your privacy is important to us. Please review our Privacy
                  Policy, which also governs your use of the service, to
                  understand our practices.
                </p>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  5. Prohibited Uses
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                  You may not use our service:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 md:space-y-2 ml-4 text-sm md:text-base">
                  <li>
                    For any unlawful purpose or to solicit others to perform
                    unlawful acts
                  </li>
                  <li>
                    To violate any international, federal, provincial, or state
                    regulations, rules, laws, or local ordinances
                  </li>
                  <li>
                    To infringe upon or violate our intellectual property rights
                    or the intellectual property rights of others
                  </li>
                  <li>
                    To harass, abuse, insult, harm, defame, slander, disparage,
                    intimidate, or discriminate
                  </li>
                  <li>To submit false or misleading information</li>
                </ul>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  6. Disclaimer
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  The materials on Kawane Studio's website are provided on an
                  'as is' basis. Kawane Studio makes no warranties, expressed or
                  implied, and hereby disclaims and negates all other warranties
                  including without limitation, implied warranties or conditions
                  of merchantability, fitness for a particular purpose, or
                  non-infringement of intellectual property or other violation
                  of rights.
                </p>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  7. Limitations
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  In no event shall Kawane Studio or its suppliers be liable for
                  any damages (including, without limitation, damages for loss
                  of data or profit, or due to business interruption) arising
                  out of the use or inability to use the materials on Kawane
                  Studio's website, even if Kawane Studio or a Kawane Studio
                  authorized representative has been notified orally or in
                  writing of the possibility of such damage.
                </p>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  8. Contact Information
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  If you have any questions about these Terms of Service, please
                  contact us at:
                </p>
                <div className="mt-3 md:mt-4 p-3 md:p-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-700 text-sm md:text-base">
                    <strong>Email:</strong> evenext.corp@gmail.com
                    <br />
                    <strong>Address:</strong> Jakarta, Indonesia
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
