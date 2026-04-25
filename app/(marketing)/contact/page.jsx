export const metadata = { title: 'Contact | PrepTrack' };

export default function ContactPage() {
  return (
    <div className="min-h-[80vh] py-24 bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in <span className="text-[var(--amber)]">Touch</span></h1>
          <p className="text-[var(--text-secondary)]">Have questions? We'd love to hear from you.</p>
        </div>
        
        <form className="space-y-4 glass-card p-8">
          <div>
            <label className="label">Name</label>
            <input type="text" className="input" placeholder="Your name" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" placeholder="name@example.com" />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea className="input min-h-[150px]" placeholder="How can we help you?"></textarea>
          </div>
          <button type="button" className="w-full py-3 bg-[var(--accent)] text-white rounded-lg font-medium shadow-[0_0_20px_var(--accent-glow)] mt-4 hover:bg-[#5b54ff] transition-colors">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
