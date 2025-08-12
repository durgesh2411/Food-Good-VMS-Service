import React from "react";
import { Link } from "react-router-dom";

function VolunteerPage() {
  const benefits = [
    {
      icon: "🎯",
      title: "Make Real Impact",
      description: "Directly contribute to creating the next generation of doctors from underprivileged backgrounds."
    },
    {
      icon: "🤝",
      title: "Professional Growth",
      description: "Enhance your leadership, teaching, and mentoring skills while giving back to society."
    },
    {
      icon: "🌟",
      title: "Recognition",
      description: "Be recognized in our Hall of Fame and receive certificates for your valuable contributions."
    },
    {
      icon: "🎓",
      title: "Experience Sharing",
      description: "Share your medical expertise and journey with aspiring students who need guidance."
    }
  ];

  const requirements = [
    "Medical degree (MBBS/MD) or currently pursuing medical education",
    "Passion for teaching and mentoring underprivileged students",
    "Commitment to donate at least 2 hours per week",
    "Strong communication skills in Hindi/English",
    "Empathy and patience to work with diverse student backgrounds"
  ];

  const roles = [
    {
      title: "NEET Subject Mentor",
      description: "Teach Physics, Chemistry, or Biology to NEET aspirants",
      time: "4-6 hours/week",
      impact: "Direct academic support"
    },
    {
      title: "Career Counselor",
      description: "Guide students on medical career paths and college selection",
      time: "2-3 hours/week", 
      impact: "Strategic guidance"
    },
    {
      title: "Motivational Mentor",
      description: "Provide emotional support and motivation during preparation",
      time: "2-4 hours/week",
      impact: "Mental wellness"
    },
    {
      title: "Study Group Leader",
      description: "Lead group study sessions and peer learning activities",
      time: "3-5 hours/week",
      impact: "Collaborative learning"
    }
  ];

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#2b3359] to-[#1e293b]">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white mb-6">
              Become a Mentor
            </h1>
            <p className="max-w-[800px] text-gray-200 md:text-xl mx-auto mb-8">
              Join our mission to empower aspiring doctors from underprivileged backgrounds. 
              Your expertise and guidance can transform lives and create the next generation of medical professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#f2b705] px-8 text-sm font-medium text-[#2b3359] shadow transition-colors hover:bg-[#fbbf24]"
              >
                Join as Mentor
              </Link>
              <Link 
                to="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white px-8 text-sm font-medium text-white shadow transition-colors hover:bg-white/10"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                Why Become a Mentor?
              </h2>
              <p className="text-gray-600 md:text-xl max-w-[600px] mx-auto">
                Experience the joy of giving back while developing your own skills
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-[#2b3359]">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                Mentoring Opportunities
              </h2>
              <p className="text-gray-600 md:text-xl max-w-[600px] mx-auto">
                Choose a role that matches your expertise and availability
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {roles.map((role, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <h3 className="text-xl font-bold mb-3 text-[#2b3359]">{role.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{role.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="bg-[#f2b705]/10 text-[#2b3359] px-3 py-1 rounded-full font-medium">
                      {role.time}
                    </span>
                    <span className="text-[#f2b705] font-semibold">
                      Impact: {role.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                  Mentor Requirements
                </h2>
                <p className="text-gray-600 md:text-xl">
                  We welcome passionate individuals who meet these basic criteria
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-[#2b3359] to-[#1e293b] rounded-2xl p-8 md:p-12 text-white">
                <ul className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-[#f2b705] text-xl">✓</span>
                      <span className="text-lg leading-relaxed">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#f2b705]">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#2b3359] mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-[#2b3359]/80 md:text-xl max-w-[600px] mx-auto mb-8">
              Join our community of dedicated mentors and help create the next generation of doctors
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#2b3359] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#1e293b]"
              >
                Apply Now
              </Link>
              <Link 
                to="/hall-of-fame"
                className="inline-flex h-12 items-center justify-center rounded-md border border-[#2b3359] px-8 text-sm font-medium text-[#2b3359] shadow transition-colors hover:bg-[#2b3359]/10"
              >
                Meet Our Team
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default VolunteerPage;
