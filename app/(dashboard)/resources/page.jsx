'use client';

import Card from '@/components/ui/Card';
import { ExternalLink, Video, FileText, Globe } from 'lucide-react';

const resources = [
  {
    title: 'Mrunal Patel Economy',
    type: 'youtube',
    exam: 'upsc',
    url: 'https://youtube.com',
    description: 'Comprehensive Indian Economy lectures for UPSC CSE.'
  },
  {
    title: 'Physics Wallah Mechanics',
    type: 'youtube',
    exam: 'jee',
    url: 'https://youtube.com',
    description: 'Deep dive into Newtonian Mechanics and Kinematics.'
  },
  {
    title: 'NCERT Biology Class 11 & 12',
    type: 'pdf',
    exam: 'neet',
    url: '#',
    description: 'The absolute foundation for NEET UG Biology section.'
  },
  {
    title: 'Vision IAS Monthly Current Affairs',
    type: 'web',
    exam: 'upsc',
    url: '#',
    description: 'Monthly compilations of current affairs for GS papers.'
  }
];

export default function ResourcesPage() {
  const getIcon = (type) => {
    if (type === 'youtube') return <Video className="text-[#FF0000]" />;
    if (type === 'pdf') return <FileText className="text-[var(--red)]" />;
    return <Globe className="text-[var(--teal)]" />;
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold mb-1">Curated Resources</h1>
        <p className="text-[var(--text-secondary)]">High-quality study materials selected by toppers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res, i) => (
          <Card key={i} className="flex flex-col h-full" hover>
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)]">
                {getIcon(res.type)}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)]">
                {res.exam}
              </span>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{res.title}</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6 flex-1">
              {res.description}
            </p>
            
            <a 
              href={res.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-auto flex items-center justify-center gap-2 w-full py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-muted)] hover:text-[var(--accent)] text-sm font-medium rounded-lg transition-colors border border-[var(--border)]"
            >
              Open Resource <ExternalLink size={14} />
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
