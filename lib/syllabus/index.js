import { upscSyllabus } from './upsc';
import { jeeSyllabus } from './jee';
import { neetSyllabus } from './neet';

export const syllabusData = {
  upsc: upscSyllabus,
  jee: jeeSyllabus,
  neet: neetSyllabus,
};

/**
 * Get syllabus for a specific exam type
 */
export function getSyllabus(examType) {
  return syllabusData[examType] || syllabusData.upsc;
}

/**
 * Get all topics as a flat array for a given exam
 */
export function getAllTopics(examType) {
  const syllabus = getSyllabus(examType);
  const topics = [];
  
  syllabus.papers.forEach(paper => {
    paper.subjects.forEach(subject => {
      subject.topics.forEach(topic => {
        topics.push({
          ...topic,
          paperName: paper.name,
          subjectName: subject.name,
          paperId: paper.id,
          subjectId: subject.id,
        });
      });
    });
  });
  
  return topics;
}

/**
 * Get total topic count for an exam
 */
export function getTopicCount(examType) {
  return getAllTopics(examType).length;
}

/**
 * Find a topic by its ID
 */
export function findTopic(examType, topicId) {
  return getAllTopics(examType).find(t => t.id === topicId);
}

/**
 * Search topics by name
 */
export function searchTopics(examType, query) {
  if (!query) return [];
  const q = query.toLowerCase();
  return getAllTopics(examType).filter(t => 
    t.name.toLowerCase().includes(q) || 
    t.subjectName.toLowerCase().includes(q) ||
    t.paperName.toLowerCase().includes(q)
  );
}

/**
 * Get available exam types
 */
export const examTypes = [
  { id: 'upsc', name: 'UPSC Civil Services', icon: '🏛️' },
  { id: 'jee', name: 'JEE Main + Advanced', icon: '⚡' },
  { id: 'neet', name: 'NEET UG', icon: '🩺' },
];
