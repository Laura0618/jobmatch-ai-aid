import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-resume.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
  onLoadMockData: () => void;
}

export const HeroSection = ({ onGetStarted, onLoadMockData }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Professional workspace"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-12 animate-float backdrop-blur-sm">
            ✨ AI-Powered Resume Optimization
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-black text-foreground mb-12 leading-tight tracking-tight">
            Transform Your Resume for
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Every Job</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed font-light">
            Upload your resume, paste any job description, and watch AI craft a perfectly tailored resume
            and cover letter that gets you noticed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Button
              variant="hero"
              size="lg"
              onClick={onGetStarted}
              className="text-lg px-12 py-6 h-auto rounded-2xl font-semibold shadow-2xl"
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onLoadMockData}
              className="text-lg px-12 py-6 h-auto border-2 hover:bg-primary/5 rounded-2xl font-medium"
            >
              Preview Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-3xl mx-auto">
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-black text-primary mb-3">2 Min</div>
              <div className="text-muted-foreground font-medium">Average Process Time</div>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-black text-accent mb-3">95%</div>
              <div className="text-muted-foreground font-medium">Match Accuracy</div>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-black text-primary mb-3">Free</div>
              <div className="text-muted-foreground font-medium">No Hidden Costs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/20 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-float" style={{ animationDelay: "2s" }}></div>
    </section>
  );
};