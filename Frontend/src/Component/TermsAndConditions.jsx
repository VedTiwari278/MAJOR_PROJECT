import React from "react";

const sections = [
  {
    title: "Acceptance of Terms",
    text: "By using Campus Craving, you agree to abide by all rules and regulations. Please read these terms carefully before using our services.",
  },
  {
    title: "Ordering & Payments",
    text: "All orders must be paid in full at the time of purchase. Prices and menu availability may change without notice.",
  },
  {
    title: "Refund Policy",
    text: "Refunds or cancellations follow restaurant-specific policies. Once an order is confirmed, refunds may not be guaranteed.",
  },
  {
    title: "User Responsibilities",
    text: "Users must provide accurate information and avoid fraudulent activity. Misuse may result in account suspension or termination.",
  },
  {
    title: "Privacy Policy",
    text: "Your personal data is securely handled and only used to process orders and improve user experience.",
  },
  {
    title: "Changes to Terms",
    text: "We may update these terms from time to time. Continued use of our platform constitutes acceptance of any changes.",
  },
];

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-16 px-5">
      <div className="max-w-3xl mx-auto">
        <h1 className="mb-4 text-3xl font-extrabold text-red-700">
          Terms & Conditions
        </h1>
        <p className="mb-10 text-gray-500 text-lg">
          Welcome to <strong>Campus Craving</strong>. By using our service, you
          agree to these terms and conditions. Please read them carefully.
        </p>

        {sections.map((section, index) => (
          <div
            key={index}
            className="mb-5 p-5 bg-white rounded-lg shadow transition-transform transform hover:-translate-y-1 hover:shadow-xl"
          >
            <h5 className="mb-2 text-gray-800 font-semibold text-lg">
              {section.title}
            </h5>
            <p className="text-gray-500 text-base">{section.text}</p>
          </div>
        ))}

        <div className="text-center mt-10 text-gray-400 text-sm">
          <p>Last Updated: August 2025</p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
