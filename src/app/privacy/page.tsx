import { Metadata } from "next";
import { CartDrawer } from "@/components/home/cart-drawer";
import { HomeFooter } from "@/components/home/footer";
import { HomeNavigation } from "@/components/home/navigation";

export const metadata: Metadata = {
  title: "Privacy Policy | Kawane Studio",
  description: "Privacy Policy for Kawane Studio",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeNavigation />
      <main className="flex-1 bg-gray-50 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
              Privacy Policy
            </h1>
            
            <div className="prose prose-sm md:prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  1. Information We Collect
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                  We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 md:space-y-2 ml-4 text-sm md:text-base">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Shipping and billing addresses</li>
                  <li>Communication preferences</li>
                </ul>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 md:space-y-2 ml-4 text-sm md:text-base">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, security alerts, and support messages</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Communicate with you about products, services, offers, and events</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                </ul>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  3. Information Sharing
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 md:space-y-2 ml-4 mt-3 md:mt-4 text-sm md:text-base">
                  <li>With service providers who assist us in operating our website and conducting our business</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a merger, acquisition, or sale of assets</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  4. Data Security
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
                </p>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  5. Cookies and Tracking
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  6. Your Rights
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 md:space-y-2 ml-4 text-sm md:text-base">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your data</li>
                  <li>Withdraw consent for data processing</li>
                </ul>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  7. Data Retention
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.
                </p>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  8. Children's Privacy
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                </p>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  9. Changes to This Policy
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  10. Contact Us
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-3 md:mt-4 p-3 md:p-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-700 text-sm md:text-base">
                    <strong>Email:</strong> evenext.corp@gmail.com<br />
                    <strong>Address:</strong> Jakarta, Indonesia
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <HomeFooter />
      <CartDrawer />
    </div>
  );
}