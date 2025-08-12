import React, { useState } from "react";
import { toast } from "react-toastify";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiry_type: ""
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
      
      toast.success("Thank you for contacting us! We'll get back to you within 24 hours.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        inquiry_type: ""
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inquiryTypes = [
    "General Information",
    "NEET Coaching Program",
    "Volunteer/Mentor Application",
    "Student Admission",
    "Donation & Support",
    "Partnership Opportunities",
    "Media & Press Inquiries",
    "Technical Support"
  ];

  const contactInfo = [
    {
      icon: "📧",
      title: "Email",
      details: "contact@liftforupliftment.org",
      description: "General inquiries and support"
    },
    {
      icon: "📱",
      title: "Phone",
      details: "+91-9876543210",
      description: "Mon-Sat, 9:00 AM - 6:00 PM"
    },
    {
      icon: "📍",
      title: "Address",
      details: "123 Education Hub, Medical District",
      description: "Mumbai, Maharashtra 400001"
    },
    {
      icon: "🕒",
      title: "Office Hours",
      details: "Mon-Sat: 9:00 AM - 6:00 PM",
      description: "Closed on Sundays and holidays"
    }
  ];

  const departments = [
    {
      title: "Admissions Office",
      email: "admissions@liftforupliftment.org",
      phone: "+91-9876543211",
      description: "Student applications and enrollment"
    },
    {
      title: "Volunteer Coordination",
      email: "volunteers@liftforupliftment.org", 
      phone: "+91-9876543212",
      description: "Mentor applications and volunteer programs"
    },
    {
      title: "Donations & Partnerships",
      email: "partnerships@liftforupliftment.org",
      phone: "+91-9876543213",
      description: "Funding support and collaboration"
    },
    {
      title: "Technical Support",
      email: "support@liftforupliftment.org",
      phone: "+91-9876543214",
      description: "Website and platform assistance"
    }
  ];

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#2b3359] to-[#1e293b]">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white mb-6">
              Contact Us
            </h1>
            <p className="max-w-[800px] text-gray-200 md:text-xl mx-auto">
              Have questions about our programs, want to volunteer, or need support? 
              We're here to help and would love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-[#2b3359]">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label htmlFor="inquiry_type" className="block text-sm font-semibold text-gray-700 mb-2">
                        Inquiry Type *
                      </label>
                      <select
                        id="inquiry_type"
                        name="inquiry_type"
                        value={formData.inquiry_type}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent"
                      >
                        <option value="">Select inquiry type</option>
                        {inquiryTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
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
                      placeholder="Brief subject of your inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-[#2b3359] to-[#1e293b] text-white font-medium rounded-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-[#2b3359]">Get in Touch</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{info.icon}</div>
                        <div>
                          <h3 className="text-xl font-bold mb-1 text-[#2b3359]">{info.title}</h3>
                          <p className="text-lg font-semibold text-gray-800 mb-1">{info.details}</p>
                          <p className="text-gray-600">{info.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Departments Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                Contact Specific Departments
              </h2>
              <p className="text-gray-600 md:text-xl max-w-[600px] mx-auto">
                For faster assistance, reach out directly to the relevant department
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {departments.map((dept, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <h3 className="text-lg font-bold mb-3 text-[#2b3359]">{dept.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{dept.description}</p>
                  <div className="space-y-2">
                    <a 
                      href={`mailto:${dept.email}`}
                      className="block text-[#f2b705] hover:text-[#2b3359] font-medium text-sm transition-colors"
                    >
                      {dept.email}
                    </a>
                    <a 
                      href={`tel:${dept.phone}`}
                      className="block text-gray-600 hover:text-[#2b3359] font-medium text-sm transition-colors"
                    >
                      {dept.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                Quick Answers
              </h2>
              <p className="text-gray-600 md:text-xl max-w-[600px] mx-auto">
                Find answers to commonly asked questions
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-[#2b3359] to-[#1e293b] rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Response Time</h3>
                <p className="text-gray-200">We typically respond to all inquiries within 24 hours during business days.</p>
              </div>
              <div className="bg-gradient-to-br from-[#f2b705] to-[#fbbf24] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 text-[#2b3359]">Office Visits</h3>
                <p className="text-[#2b3359]">Office visits are by appointment only. Please call ahead to schedule a meeting.</p>
              </div>
              <div className="bg-white border-2 border-[#f2b705] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 text-[#2b3359]">Emergency Contact</h3>
                <p className="text-gray-600">For urgent matters, call our emergency line: +91-9876543200 (available 24/7)</p>
              </div>
              <div className="bg-white border-2 border-[#2b3359] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 text-[#2b3359]">Language Support</h3>
                <p className="text-gray-600">We provide support in Hindi, English, and Marathi languages.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ContactPage;
