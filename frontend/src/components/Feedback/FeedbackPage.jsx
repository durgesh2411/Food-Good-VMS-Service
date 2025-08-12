import React, { useState } from "react";
import { toast } from "react-toastify";

function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    rating: 5,
    category: "",
    subject: "",
    message: "",
    suggestions: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast.success("Thank you for your feedback! We appreciate your input and will review it carefully.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "",
        rating: 5,
        category: "",
        subject: "",
        message: "",
        suggestions: ""
      });
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    "Website Experience",
    "NEET Coaching Program",
    "Mentorship Quality", 
    "Event Organization",
    "Communication",
    "Technical Issues",
    "Suggestions for Improvement",
    "General Feedback"
  ];

  const roles = [
    "Student",
    "Parent/Guardian",
    "Mentor/Volunteer",
    "Donor/Supporter",
    "Partner Organization",
    "General Visitor"
  ];

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#2b3359] to-[#1e293b]">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white mb-6">
              Share Your Feedback
            </h1>
            <p className="max-w-[800px] text-gray-200 md:text-xl mx-auto">
              Your feedback helps us improve our programs and better serve aspiring doctors from underprivileged backgrounds. 
              We value every suggestion and comment.
            </p>
          </div>
        </section>

        {/* Feedback Form Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold mb-6 text-[#2b3359]">Personal Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Role *
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent"
                      >
                        <option value="">Select your role</option>
                        {roles.map((role, index) => (
                          <option key={index} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="rating" className="block text-sm font-semibold text-gray-700 mb-2">
                        Overall Rating *
                      </label>
                      <select
                        id="rating"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ - Excellent</option>
                        <option value={4}>⭐⭐⭐⭐ - Very Good</option>
                        <option value={3}>⭐⭐⭐ - Good</option>
                        <option value={2}>⭐⭐ - Fair</option>
                        <option value={1}>⭐ - Needs Improvement</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Feedback Details */}
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold mb-6 text-[#2b3359]">Feedback Details</h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                        Feedback Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        {categories.map((category, index) => (
                          <option key={index} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent"
                        placeholder="Brief subject of your feedback"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                        Detailed Feedback *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent"
                        placeholder="Please share your detailed feedback, experience, or concerns..."
                      />
                    </div>
                    <div>
                      <label htmlFor="suggestions" className="block text-sm font-semibold text-gray-700 mb-2">
                        Suggestions for Improvement
                      </label>
                      <textarea
                        id="suggestions"
                        name="suggestions"
                        value={formData.suggestions}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent"
                        placeholder="Any suggestions on how we can improve our services?"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-14 items-center justify-center rounded-lg bg-gradient-to-r from-[#2b3359] to-[#1e293b] px-12 text-lg font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                Other Ways to Reach Us
              </h2>
              <p className="text-gray-600 md:text-xl max-w-[600px] mx-auto">
                Prefer to speak directly? Here are other ways to get in touch
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="text-xl font-bold mb-2 text-[#2b3359]">Email</h3>
                <p className="text-gray-600">feedback@liftforupliftment.org</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold mb-2 text-[#2b3359]">Phone</h3>
                <p className="text-gray-600">+91-9876543210</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-bold mb-2 text-[#2b3359]">Chat</h3>
                <p className="text-gray-600">Available 9 AM - 6 PM</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default FeedbackPage;
