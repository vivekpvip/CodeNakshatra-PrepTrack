import FeaturesGrid from '@/components/landing/FeaturesGrid';

export const metadata = { title: 'Features | PrepTrack' };

export default function FeaturesPage() {
  return (
    <div className="pt-24 pb-12 bg-[var(--bg-primary)]">
      <div className="text-center mb-12 max-w-2xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Every tool you need. <span className="text-[var(--teal)]">Zero clutter.</span></h1>
        <p className="text-xl text-[var(--text-secondary)]">Explore the features that make PrepTrack the ultimate study OS.</p>
      </div>
      <FeaturesGrid />
    </div>
  );
}
