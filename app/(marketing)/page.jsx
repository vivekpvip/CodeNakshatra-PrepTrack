import HeroSection from '@/components/landing/HeroSection';
import StatsBanner from '@/components/landing/StatsBanner';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import HowItWorks from '@/components/landing/HowItWorks';
import TestimonialsSlider from '@/components/landing/TestimonialsSlider';
import CTASection from '@/components/landing/CTASection';

export const metadata = {
  title: 'PrepTrack | Your Exam Command Center',
  description: 'The AI-powered study OS for UPSC, JEE & NEET aspirants who are serious about cracking it.',
};

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsBanner />
      <FeaturesGrid />
      <HowItWorks />
      <TestimonialsSlider />
      <CTASection />
    </>
  );
}
