import React from 'react';
import { useTranslation } from 'react-i18next';

function HallOfFame() {
  const { t } = useTranslation();

  const founders = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      role: "Founder & CEO",
      image: "/placeholder-user.jpg",
      description: "A passionate advocate for child nutrition with 15+ years of experience in non-profit management."
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Co-Founder & Director",
      image: "/placeholder-user.jpg",
      description: "Former corporate executive who left his career to dedicate his life to fighting child hunger."
    }
  ];

  const leadVolunteers = [
    {
      id: 1,
      name: "Anita Patel",
      role: "Lead Volunteer Coordinator",
      image: "/placeholder-user.jpg",
      achievements: "Coordinated 500+ meal distributions, trained 200+ volunteers",
      yearsOfService: 5
    },
    {
      id: 2,
      name: "Mohammad Ali",
      role: "Community Outreach Lead",
      image: "/placeholder-user.jpg",
      achievements: "Established partnerships with 50+ schools, reached 10,000+ children",
      yearsOfService: 4
    },
    {
      id: 3,
      name: "Sneha Reddy",
      role: "Program Manager",
      image: "/placeholder-user.jpg",
      achievements: "Implemented nutrition programs in 30+ locations, improved meal quality by 40%",
      yearsOfService: 3
    }
  ];

  const successStories = [
    {
      id: 1,
      title: "From Hunger to NEET Success: Rahul's Journey",
      student: "Rahul Verma",
      achievement: "NEET AIR 245",
      image: "/placeholder-user.jpg",
      story: "Rahul, who once struggled with hunger, received nutritious meals through our program for 8 years. With proper nutrition fueling his studies, he cracked NEET with an All India Rank of 245 and is now pursuing MBBS at AIIMS Delhi.",
      currentStatus: "1st Year MBBS, AIIMS Delhi"
    },
    {
      id: 2,
      title: "Breaking Barriers: Priya's Medical Dream",
      student: "Priya Singh",
      achievement: "NEET AIR 156",
      image: "/placeholder-user.jpg",
      story: "Coming from a family that couldn't afford proper meals, Priya benefited from our nutrition program throughout her school years. Her determination, combined with proper nutrition, helped her achieve NEET AIR 156.",
      currentStatus: "2nd Year MBBS, Maulana Azad Medical College"
    },
    {
      id: 3,
      title: "Against All Odds: Arjun's Triumph",
      student: "Arjun Patel",
      achievement: "NEET AIR 89",
      image: "/placeholder-user.jpg",
      story: "Arjun's family couldn't provide regular meals, but our program ensured he never went hungry. His incredible dedication and the nutritional support he received helped him secure NEET AIR 89.",
      currentStatus: "3rd Year MBBS, King George's Medical University"
    }
  ];

  const organizationAchievements = [
    {
      metric: "2,50,000+",
      description: "Total Meals Served",
      icon: "🍽️"
    },
    {
      metric: "15,000+",
      description: "Children Supported",
      icon: "👶"
    },
    {
      metric: "200+",
      description: "Schools Partnered",
      icon: "🏫"
    },
    {
      metric: "50+",
      description: "NEET Qualifiers",
      icon: "🎓"
    },
    {
      metric: "8",
      description: "Years of Service",
      icon: "⭐"
    },
    {
      metric: "500+",
      description: "Active Volunteers",
      icon: "🤝"
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {organizationAchievements.map((achievement, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="text-2xl font-bold text-primary mb-2">{achievement.metric}</div>
                  <div className="text-sm text-muted-foreground">{achievement.description}</div>
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
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {founders.map((founder) => (
                <div key={founder.id} className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
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
            <div className="grid md:grid-cols-3 gap-8">
              {leadVolunteers.map((volunteer) => (
                <div key={volunteer.id} className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <img
                    src={volunteer.image}
                    alt={volunteer.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-bold mb-2">{volunteer.name}</h3>
                  <p className="text-primary font-semibold mb-2">{volunteer.role}</p>
                  <p className="text-sm text-muted-foreground mb-3">{volunteer.achievements}</p>
                  <div className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full inline-block">
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
            <div className="grid gap-8">
              {successStories.map((story) => (
                <div key={story.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={story.image}
                        alt={story.student}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-8">
                      <div className="flex items-center mb-4">
                        <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold mr-3">
                          {story.achievement}
                        </div>
                        <span className="text-sm text-muted-foreground">{story.currentStatus}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{story.title}</h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{story.story}</p>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-primary">- {story.student}</span>
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
