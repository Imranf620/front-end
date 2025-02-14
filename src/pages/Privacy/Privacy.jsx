
import React from "react";
import HomeNav from "../../components/homeNav/HomeNav";
import Footer from "../../components/footer/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <HomeNav />
      <div className="max-w-3xl mt-16 mx-auto p-6 md:p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-semibold text-center text-gray-800 mb-8">
          Privacy Policy
        </h1>
        <div className="space-y-6 text-lg text-gray-700">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            1. Information We Collect
          </h2>
          <p>
            We may collect the following types of personal information when you
            use our services:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Account Information: Name, email address, and other contact
              details.
            </li>
            <li>File Data: Files that you upload to our cloud storage.</li>
            <li>
              Usage Data: Information about how you interact with the site,
              including IP addresses, browser information, and activity logs.
            </li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            2. How We Use Your Information
          </h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and improve our services.</li>
            <li>
              To send you notifications regarding your account and uploads.
            </li>
            <li>To respond to your inquiries and provide customer support.</li>
            <li>
              To analyze usage patterns and improve the site functionality.
            </li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            3. Cookies and Tracking Technologies
          </h2>
          <p>
            We use cookies and similar technologies to enhance your experience
            on our site. Cookies help us analyze web traffic and remember your
            preferences. You can disable cookies in your browser, but doing so
            may affect your experience on the site.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            4. Data Security
          </h2>
          <p>
            We use industry-standard security measures to protect your data from
            unauthorized access, disclosure, or alteration. However, no method
            of transmission over the internet is 100% secure, and we cannot
            guarantee complete security.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            5. Data Retention
          </h2>
          <p>
            We retain your personal data for as long as necessary to provide our
            services and fulfill the purposes outlined in this Privacy Policy,
            unless a longer retention period is required by law.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            6. Third-Party Sharing
          </h2>
          <p>
            We do not share your personal data with third parties, except in the
            following cases:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              With service providers who assist in delivering our services
              (e.g., cloud hosting services).
            </li>
            <li>
              In response to legal requests, such as subpoenas or court orders.
            </li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            7. User Rights
          </h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access, correct, or delete your personal data.</li>
            <li>Object to the processing of your data.</li>
            <li>
              Withdraw your consent at any time (if consent is the basis for
              processing).
            </li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            8. Children’s Privacy
          </h2>
          <p>
            Our services are not intended for children under the age of 13. We
            do not knowingly collect personal data from children under 13. If we
            become aware that we have inadvertently collected such data, we will
            take steps to delete it.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            9. Changes to Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated "Last Updated" date.
            Your continued use of our service after changes are posted
            constitutes your acceptance of the updated Privacy Policy.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            10. Contact Us
          </h2>
          <p>
            If you have any questions or concerns about our Privacy Policy,
            please contact us at{" "}
            <a href="mailto:admin@gofilez.com" className="text-blue-500">
            admin@gofilez.com
            </a>
            .
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;