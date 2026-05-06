"use client";

import { useState } from "react";
import { ChevronDown, Mail, Phone, X } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "How can I search for books?",
    answer: "You can use the search bar at the top of the page to find books by title, author, or category. Simply type your query and click the Search button."
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and digital payment methods including PayPal and Apple Pay."
  },
  {
    id: 3,
    question: "How long does delivery take?",
    answer: "Standard delivery takes 3-5 business days. Express delivery is available for 1-2 business days. Free delivery is available for orders over €30."
  },
  {
    id: 4,
    question: "Can I return books?",
    answer: "Yes, you can return books within 30 days of purchase if they are in original condition. Please contact our customer service for the return process."
  },
  {
    id: 5,
    question: "Do you have e-books available?",
    answer: "Yes! We offer a wide selection of e-books in multiple languages. You can access them immediately after purchase."
  },
  {
    id: 6,
    question: "What is an audiobook?",
    answer: "Audiobooks are narrated versions of books that you can listen to. We have a collection of audiobooks available in English, Turkish, Romanian, and Bulgarian."
  },
  {
    id: 7,
    question: "How do I create an account?",
    answer: "Click on the user icon in the top right corner, then select 'Sign Up'. Fill in your email and password to create your account."
  },
  {
    id: 8,
    question: "Is my personal information secure?",
    answer: "Yes, we use industry-standard encryption to protect your personal and payment information. Your data is secure with us."
  },
];

export default function QAPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const toggleItem = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-teal-950 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-wide">Q&A</h1>
          <p className="text-lg text-teal-100 max-w-2xl mx-auto">
            Find answers to frequently asked questions about blendartbook. Can't find what you're looking for? 
            <span className="block mt-2 text-teal-300">Contact our customer service team.</span>
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-4">
          {faqData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-teal-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-teal-50/50 transition-colors duration-200"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  {item.question}
                </h3>
                <ChevronDown
                  size={24}
                  className={`text-teal-600 flex-shrink-0 transition-transform duration-300 ${
                    expandedId === item.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedId === item.id && (
                <div className="px-6 pb-6 pt-0 border-t border-teal-100">
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-teal-50 to-teal-50 rounded-lg border-2 border-teal-300 p-8 text-center">
          <h2 className="text-2xl font-bold text-teal-950 mb-3">Still have questions?</h2>
          <p className="text-gray-700 mb-6">
            Our customer service team is here to help you.
          </p>
          <button 
            onClick={() => setShowContactModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full relative">
            {/* Close Button */}
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>

            {/* Modal Content */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-teal-950 mb-6">Contact Us</h2>

              {/* Email Section */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="bg-teal-100 p-3 rounded-lg">
                    <Mail size={24} className="text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                    <a 
                      href="mailto:support@blendartbook.com"
                      className="text-teal-600 hover:text-teal-700 font-semibold break-all"
                    >
                      support@blendartbook.com
                    </a>
                    <p className="text-sm text-gray-600 mt-2">
                      We respond within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone Section */}
              <div className="mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Phone size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Phone</h3>
                    <a 
                      href="tel:+40123456789"
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      +40 (123) 456-789
                    </a>
                    <p className="text-sm text-gray-600 mt-2">
                      Monday - Friday, 9AM - 6PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowContactModal(false)}
                className="w-full bg-teal-950 hover:bg-teal-800 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}