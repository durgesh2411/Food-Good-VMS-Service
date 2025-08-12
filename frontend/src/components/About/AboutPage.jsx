import React from "react";
import { Link } from "react-router-dom";

function AboutPage() {
  const milestones = [
    {
      year: "2009",
      title: "Foundation",
      description: "Lift for Upliftment was founded with a vision to provide free NEET coaching to underprivileged students."
    },
    {
      year: "2012",
      title: "First Success",
      description: "Our first batch of 25 students achieved remarkable NEET results, with 20 students qualifying for medical colleges."
    },
    {
      year: "2015",
      title: "Expansion",
      description: "Opened our second coaching center and introduced scholarship programs for deserving students."
    },
    {
      year: "2018",
      title: "Digital Revolution",
      description: "Launched online coaching modules and digital learning resources to reach more students."
    },
    {
      year: "2020",
      title: "Pandemic Response",
      description: "Adapted quickly to provide uninterrupted online education during COVID-19 lockdowns."
    },
    {
      year: "2025",
      title: "Celebrating Success",
      description: "Proudly celebrating 220+ doctors created and 500+ students mentored over 15+ years of excellence."
    }
  ];

  const values = [
    {
      icon: "🎯",
      title: "Mission-Driven",
      description: "Every action we take is guided by our mission to create equal opportunities in medical education."
    },
    {
      icon: "🤝",
      title: "Community First",
      description: "We believe in the power of community support and collective effort to transform lives."
    },
    {
      icon: "📚",
      title: "Excellence in Education",
      description: "We maintain the highest standards of education quality, comparable to premium coaching institutes."
    },
    {
      icon: "💝",
      title: "Compassionate Support",
      description: "We provide not just academic coaching but also emotional and financial support to our students."
    },
    {
      icon: "🌱",
      title: "Sustainable Impact",
      description: "We focus on creating long-term, sustainable change in the lives of students and their families."
    },
    {
      icon: "🏆",
      title: "Results-Oriented",
      description: "Our success is measured by the success of our students in achieving their medical career dreams."
    }
  ];

  const stats = [
    { number: "220+", label: "Doctors Created", icon: "🎓" },
    { number: "101", label: "MBBS Graduates", icon: "👨‍⚕️" },
    { number: "500+", label: "Students Mentored", icon: "📚" },
    { number: "15+", label: "Years of Service", icon: "⭐" },
    { number: "2", label: "Coaching Centers", icon: "🏢" },
    { number: "100%", label: "Dedicated Support", icon: "💝" }
  ];

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#2b3359] to-[#1e293b]">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white mb-6">
              About Lift for Upliftment
            </h1>
            <p className="max-w-[800px] text-gray-200 md:text-xl mx-auto">
              Empowering dreams, creating doctors, transforming lives. Learn about our journey, 
              mission, and the impact we've made in medical education over the past 15 years.
            </p>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6 text-[#2b3359]">
                    Our Mission
                  </h2>
                  <div className="space-y-4 text-lg leading-relaxed text-gray-700">
                    <p>
                      To provide free, high-quality NEET coaching and mentorship to economically 
                      disadvantaged students, breaking financial barriers that prevent talented 
                      individuals from pursuing their medical career dreams.
                    </p>
                    <p>
                      We believe that every student, regardless of their financial background, 
                      deserves access to quality medical education and the opportunity to serve 
                      society as a healthcare professional.
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#f2b705] to-[#fbbf24] rounded-2xl p-8 text-center">
                  <h3 className="text-2xl font-bold text-[#2b3359] mb-4">Our Vision</h3>
                  <p className="text-[#2b3359] text-lg leading-relaxed">
                    "A future where financial constraints never limit a student's ability to 
                    become a doctor and serve humanity through medical practice."
                  </p>
                  <div className="mt-6 text-6xl">🌟</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                Our Impact in Numbers
              </h2>
              <p className="text-gray-600 md:text-xl max-w-[600px] mx-auto">
                15 years of dedication reflected in the lives we've transformed
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-2xl font-bold text-[#2b3359] mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                Our Core Values
              </h2>
              <p className="text-gray-600 md:text-xl max-w-[600px] mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-[#2b3359]">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#2b3359] to-[#1e293b]">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4 text-white">
                Our Journey
              </h2>
              <p className="text-gray-200 md:text-xl max-w-[600px] mx-auto">
                Key milestones in our mission to democratize medical education
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-[#f2b705] rounded-full flex items-center justify-center font-bold text-[#2b3359]">
                        {milestone.year}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                      <p className="text-gray-200 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#f2b705]">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#2b3359] mb-4">
              Join Our Mission
            </h2>
            <p className="text-[#2b3359]/80 md:text-xl max-w-[600px] mx-auto mb-8">
              Be part of our journey to create the next generation of doctors from underprivileged backgrounds
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/volunteer"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#2b3359] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#1e293b]"
              >
                Become a Mentor
              </Link>
              <Link 
                to="/donate"
                className="inline-flex h-12 items-center justify-center rounded-md border border-[#2b3359] px-8 text-sm font-medium text-[#2b3359] shadow transition-colors hover:bg-[#2b3359]/10"
              >
                Support Our Cause
              </Link>
              <Link 
                to="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md border border-[#2b3359] px-8 text-sm font-medium text-[#2b3359] shadow transition-colors hover:bg-[#2b3359]/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AboutPage;
