import React from "react";
import HomeNav from "../../components/homeNav/HomeNav";
import Footer from "../../components/footer/Footer";

const TermsAndConditions = () => {
  return (
    <>
      <HomeNav />
      <div className="max-w-3xl mt-16 mx-auto p-6 md:p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-semibold text-center text-gray-800 mb-8">
          Terms and Conditions
        </h1>
        <div className="space-y-6 text-lg text-gray-700">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using gofilez ("we", "our", "us"), you
            agree to comply with and be bound by these Terms and Conditions. If
            you do not agree with any of these terms, you should not use our
            service.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            2. User Responsibilities
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and ensuring the security of your files.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            3. Service Availability
          </h2>
          <p>
            While we strive to provide uninterrupted service, we do not
            guarantee that the service will always be available. We may suspend
            or discontinue access to the service at any time.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            4. File Upload and Ownership
          </h2>
          <p>
            You retain ownership of all files you upload to gofilez.com. By
            uploading content, you grant us a license to store, process, and
            transmit your content as necessary for the operation of the service.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            5. Prohibited Content
          </h2>
          <p>
            The following content is prohibited: Copyright-infringing content,
            Offensive, harmful, or abusive content, Malware, viruses, or other
            harmful software.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            6. Data Privacy and Security
          </h2>
          <p>
            We take reasonable steps to secure your data, but cannot guarantee
            complete protection against all risks. Your data may be stored and
            processed in accordance with applicable privacy laws.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            7. Limitations of Liability
          </h2>
          <p>
            We are not liable for any loss or damage that may result from using
            the service, including the loss of files or data.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            8. Termination of Service
          </h2>
          <p>
            We may suspend or terminate your access to the service if you
            violate these Terms and Conditions.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            9. Changes to Terms
          </h2>
          <p>
            We may update these Terms and Conditions at any time. We will notify
            you of significant changes, and your continued use of the service
            constitutes acceptance of those changes.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            10. Governing Law
          </h2>
          <p>
            These Terms and Conditions are governed by the laws. Any disputes arising from these terms will be
            handled in accordance with applicable local laws.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            11. Contact Us
          </h2>
          <p>
            If you have any questions about these Terms and Conditions, please
            contact us at{" "}
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

export default TermsAndConditions;
