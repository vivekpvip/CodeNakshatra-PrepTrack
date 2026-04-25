export const metadata = { title: 'About | PrepTrack' };

export default function AboutPage() {
  return (
    <div className="min-h-[80vh] py-24 bg-[var(--bg-primary)]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Built by Aspirants, <br/><span className="text-[var(--accent)]">for Aspirants.</span></h1>
        
        <div className="glass-card p-8 md:p-12 text-left space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed">
          <p>
            Competitive exams in India are notoriously difficult. But what makes them even harder is the lack of organization. Aspirants spend hundreds of hours just trying to figure out what to study, managing Excel sheets for syllabus tracking, and analyzing test scores manually.
          </p>
          <p>
            <strong className="text-[var(--text-primary)]">PrepTrack was born out of frustration.</strong> We realized that while there are thousands of coaching institutes providing content, no one was providing a proper "Operating System" to manage the preparation journey.
          </p>
          <p>
            By integrating advanced AI like Anthropic's Claude, we are bridging the gap between having study materials and knowing exactly how to use them. PrepTrack isn't a coaching center—it's your command center.
          </p>
        </div>
      </div>
    </div>
  );
}
