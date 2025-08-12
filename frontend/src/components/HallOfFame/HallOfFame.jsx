import React from "react";
import { useTranslation } from "react-i18next";

function HallOfFame() {
  const { t } = useTranslation();

  // Helper function to handle image loading errors
  const handleImageError = (e) => {
    e.target.src = "/placeholder-user.jpg";
  };

  const founders = [
    {
      id: 1,
      name: "Dr. Atul Dhakne",
      role: "Founder & President",
      image: "/team/dr-atul-dhakne.jpg", // Replace with actual photo
      description: "Visionary founder and president of Lift for Upliftment, Dr. Atul Dhakne has dedicated his life to empowering economically disadvantaged students achieve their medical dreams through comprehensive NEET coaching and mentorship programs."
    }
  ];

  const leadVolunteers = [
    {
      id: 1,
      name: "Dr. Mayank Tripathi",
      role: "Secretary",
      image: "/team/dr-mayank-tripathi.jpg", // Replace with actual photo
      achievements: "Strategic planning and academic program development, oversees curriculum design",
      yearsOfService: 5
    },
    {
      id: 2,
      name: "Dr. Tejas Ahire",
      role: "Treasurer",
      image: "/team/dr-tejas-ahire.jpg", // Replace with actual photo
      achievements: "Financial management and resource optimization for student programs",
      yearsOfService: 4
    },
    {
      id: 3,
      name: "Dr. Farooque Faras",
      role: "Vice-President & Dedicated Mentor",
      image: "/team/dr-farooque-faras.jpg", // Replace with actual photo
      achievements: "Medical education expertise and student guidance, ensures highest standards of academic excellence",
      yearsOfService: 6
    }
  ];

  const successStories = [
    {
      id: 1,
      title: "From Dreams to Reality: Tanishka's Medical Journey",
      student: "Tanishka Patil",
      achievement: "MBBS Graduate",
      image: "/team/students/tanishka-patil.jpg", // Replace with actual photo
      story: "Tanishka came from an economically disadvantaged background but never let circumstances define her future. Through Lift for Upliftment's comprehensive NEET coaching and mentorship, she successfully cleared the medical entrance exam and is now a practicing doctor, giving back to her community.",
      currentStatus: "MBBS Doctor, Community Healthcare"
    },
    {
      id: 2,
      title: "Breaking Barriers: Pawan's Achievement",
      student: "Pawan Dongare",
      achievement: "NEET Qualifier",
      image: "/team/students/pawan-dongare.jpg", // Replace with actual photo
      story: "Pawan's determination combined with our structured coaching program helped him overcome financial constraints and academic challenges. His success story inspires hundreds of students in our program to pursue their medical dreams relentlessly.",
      currentStatus: "Medical Student, Pursuing MBBS"
    },
    {
      id: 3,
      title: "Excellence in Adversity: Rutuja's Triumph",
      student: "Rutuja Shinde",
      achievement: "MBBS Graduate",
      image: "/team/students/rutuja-shinde.jpg", // Replace with actual photo
      story: "Rutuja exemplifies the transformative power of quality education and mentorship. Despite facing numerous socio-economic challenges, she excelled in her studies through our program and is now serving as a doctor in rural healthcare.",
      currentStatus: "MBBS Doctor, Rural Healthcare Initiative"
    }
  ];

  const organizationAchievements = [
    {
      metric: "220+",
      description: "Doctors Created",
      icon: "🎓"
    },
    {
      metric: "101",
      description: "MBBS Graduates",
      icon: "👨‍⚕️"
    },
    {
      metric: "2",
      description: "Coaching Centers",
      icon: "🏢"
    },
    {
      metric: "500+",
      description: "Students Mentored",
      icon: "📚"
    },
    {
      metric: "15+",
      description: "Years of Excellence",
      icon: "⭐"
    },
    {
      metric: "100%",
      description: "Dedicated Support",
      icon: "💝"
    }
  ];

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary to-primary/80">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary-foreground mb-6">
              {t("hallOfFame.title")}
            </h1>
            <p className="max-w-[800px] text-primary-foreground/90 md:text-xl mx-auto">
              {t("hallOfFame.subtitle")}
            </p>
          </div>
        </section>

        {/* Organization Achievements */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                {t("hallOfFame.achievements.title")}
              </h2>
              <p className="text-muted-foreground md:text-xl max-w-[600px] mx-auto">
                {t("hallOfFame.achievements.subtitle")}
              </p>
            </div>
            
            {/* Professional uniform grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
              {organizationAchievements.map((achievement, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="text-4xl mb-4">{achievement.icon}</div>
                  <div className="text-2xl font-bold text-[#2b3359] mb-2">{achievement.metric}</div>
                  <div className="text-sm text-gray-600 font-medium">{achievement.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                {t("hallOfFame.founders.title")}
              </h2>
              <p className="text-muted-foreground md:text-xl max-w-[600px] mx-auto">
                {t("hallOfFame.founders.subtitle")}
              </p>
            </div>
            
            {/* Prominent Founder Display - Extra Large & Impactful */}
            <div className="max-w-7xl mx-auto mb-20">
              {founders
                .filter(founder => founder.name === "Dr. Atul Dhakne")
                .map((founder) => (
                  <div key={founder.id} className="bg-gradient-to-br from-[#2b3359] via-[#1e293b] to-[#0f172a] rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 border-2 border-[#f2b705]/20">
                    <div className="lg:flex">
                      {/* Large Image Section */}
                      <div className="lg:w-1/2">
                        <img
                          src={founder.image}
                          alt={founder.name}
                          className="w-full h-80 md:h-96 lg:h-[500px] object-cover"
                          onError={handleImageError}
                        />
                      </div>
                      
                      {/* Expanded Content Section */}
                      <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center text-white relative">
                        {/* Decorative Elements */}
                        <div className="absolute top-8 right-8 w-20 h-20 bg-[#f2b705]/10 rounded-full blur-xl"></div>
                        <div className="absolute bottom-8 left-8 w-16 h-16 bg-[#f2b705]/20 rounded-full blur-lg"></div>
                        
                        <div className="mb-6">
                          <span className="bg-gradient-to-r from-[#f2b705] to-[#fbbf24] text-[#2b3359] px-6 py-3 rounded-full text-base font-bold shadow-lg">
                            🏆 Founder & President
                          </span>
                        </div>
                        
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#f2b705] leading-tight">
                          {founder.name}
                        </h3>
                        
                        <div className="mb-6">
                          <p className="text-[#fbbf24] text-xl md:text-2xl font-semibold">
                            Visionary Leader & Medical Education Pioneer
                          </p>
                        </div>
                        
                        <p className="text-lg md:text-xl leading-relaxed text-gray-100 mb-8">
                          {founder.description}
                        </p>
                        
                        {/* Achievement Highlights */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-[#f2b705]/10 backdrop-blur-sm rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-[#f2b705]">15+</div>
                            <div className="text-sm text-gray-300">Years Leading</div>
                          </div>
                          <div className="bg-[#f2b705]/10 backdrop-blur-sm rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-[#f2b705]">220+</div>
                            <div className="text-sm text-gray-300">Doctors Created</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-[#f2b705]">
                          <span className="text-lg">✨</span>
                          <span className="italic text-gray-300">"Empowering dreams, creating doctors, transforming lives"</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Other Founders */}
            <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
              {founders
                .filter(founder => founder.name !== "Dr. Atul Dhakne")
                .map((founder) => (
                  <div key={founder.id} className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                      onError={handleImageError}
                    />
                    <h3 className="text-xl font-bold mb-2">{founder.name}</h3>
                    <p className="text-primary font-semibold mb-4">{founder.role}</p>
                    <p className="text-muted-foreground">{founder.description}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Lead Volunteers Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                {t("hallOfFame.volunteers.title")}
              </h2>
              <p className="text-muted-foreground md:text-xl max-w-[600px] mx-auto">
                {t("hallOfFame.volunteers.subtitle")}
              </p>
            </div>
            
            {/* Professional team layout */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {leadVolunteers.map((volunteer) => (
                <div key={volunteer.id} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <img
                    src={volunteer.image}
                    alt={volunteer.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-[#f2b705]"
                    onError={handleImageError}
                  />
                  <h3 className="text-xl font-bold mb-2 text-[#2b3359]">{volunteer.name}</h3>
                  <p className="text-[#f2b705] font-semibold mb-3">{volunteer.role}</p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{volunteer.achievements}</p>
                  <div className="bg-[#2b3359]/10 text-[#2b3359] text-xs px-3 py-1 rounded-full inline-block font-medium">
                    {volunteer.yearsOfService} years of service
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                {t("hallOfFame.successStories.title")}
              </h2>
              <p className="text-muted-foreground md:text-xl max-w-[700px] mx-auto">
                {t("hallOfFame.successStories.subtitle")}
              </p>
            </div>
            
            {/* Professional success stories layout */}
            <div className="grid gap-8 max-w-6xl mx-auto">
              {successStories.map((story, index) => (
                <div key={story.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={story.image}
                        alt={story.student}
                        className="w-full h-64 md:h-full object-cover"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center mb-4">
                        <span className="bg-[#2b3359] text-white px-3 py-1 rounded-full text-sm font-semibold mr-3">
                          {story.achievement}
                        </span>
                        <span className="text-sm text-gray-600">{story.currentStatus}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-[#2b3359]">{story.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{story.story}</p>
                      <div className="text-right">
                        <span className="font-semibold text-[#f2b705] text-lg">- {story.student}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary-foreground mb-4">
              {t("hallOfFame.cta.title")}
            </h2>
            <p className="text-primary-foreground/90 md:text-xl max-w-[600px] mx-auto mb-8">
              {t("hallOfFame.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex h-12 items-center justify-center rounded-md bg-primary-foreground px-8 text-sm font-medium text-primary shadow transition-colors hover:bg-primary-foreground/90">
                {t("hallOfFame.cta.volunteer")}
              </button>
              <button className="inline-flex h-12 items-center justify-center rounded-md border border-primary-foreground px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary-foreground/10">
                {t("hallOfFame.cta.donate")}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HallOfFame;
