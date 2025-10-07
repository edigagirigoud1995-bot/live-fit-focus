import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Users, Video, Target, Shield, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userData = sessionStorage.getItem("fitcoach_user");
    if (userData) {
      const user = JSON.parse(userData);
      navigate(user.role === "instructor" ? "/instructor" : "/student");
    }
  }, [navigate]);

  const features = [
    {
      icon: Video,
      title: "Real-time Tracking",
      description: "Motion-based engagement monitoring using your webcam",
    },
    {
      icon: Target,
      title: "Smart Feedback",
      description: "Get instant alerts and suggestions to improve your workout",
    },
    {
      icon: Users,
      title: "Multi-user Support",
      description: "Instructors can monitor multiple students simultaneously",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "All processing happens locally, no video uploads",
    },
    {
      icon: Zap,
      title: "Fast & Accurate",
      description: "Powered by advanced pose detection algorithms",
    },
    {
      icon: Activity,
      title: "Accessible",
      description: "Built with WCAG 2.2 AA compliance for everyone",
    },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" aria-hidden="true" />
            <span className="text-2xl font-bold">FitCoach</span>
          </div>
          <Button 
            variant="hero"
            onClick={() => navigate("/auth")}
            aria-label="Sign in to FitCoach"
          >
            Sign In
          </Button>
        </div>
      </header>

      <main>
        <section className="gradient-hero py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-in fade-in duration-700">
              Transform Virtual Fitness
              <span className="block gradient-primary bg-clip-text text-transparent mt-2">
                With Real-time Engagement
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-in fade-in duration-700 delay-100">
              FitCoach uses AI-powered motion tracking to help instructors monitor student engagement 
              and provide personalized feedback during virtual fitness classes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in duration-700 delay-200">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate("/auth")}
                aria-label="Get started with FitCoach"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                aria-label="Learn more about FitCoach features"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-4">
              Powerful Features for Better Workouts
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Everything you need to create engaging, effective virtual fitness experiences
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 border rounded-lg bg-card hover:shadow-card transition-smooth hover:-translate-y-1"
                >
                  <feature.icon 
                    className="h-12 w-12 text-primary mb-4" 
                    aria-hidden="true" 
                  />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 gradient-hero">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Elevate Your Virtual Classes?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join instructors and students already using FitCoach to create better workout experiences.
            </p>
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => navigate("/auth")}
              aria-label="Start using FitCoach now"
            >
              Start Now - It's Free
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 FitCoach. Privacy-first fitness engagement tracking.</p>
          <p className="mt-2">Built with accessibility and security in mind.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
