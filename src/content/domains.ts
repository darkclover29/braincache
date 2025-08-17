export type DomainMeta = { title: string; description: string; icon: string }
export const DOMAIN_META: Record<string, DomainMeta> = {
  'foundations': { title: 'Foundations', description: 'OS, DBMS, CN, DSA, OOP, CA, Compilers, Distributed Systems, Discrete Math', icon: '📚' },
  'java': { title: 'Java', description: 'Language, collections, concurrency, JVM & programming patterns', icon: '☕' },
  'development': { title: 'Development', description: 'React, Spring Boot, SQL, best practices', icon: '🧑‍💻' },
}
export const SECTION_TITLES: Record<string, string> = {
  'operating-systems': 'Operating Systems',
  'dbms': 'DBMS',
  'computer-networks': 'Computer Networks',
  'dsa': 'Data Structures & Algorithms',
  'oop': 'Object-Oriented Programming',
  'computer-architecture': 'Computer Architecture',
  'compiler-design': 'Compiler Design',
  'distributed-systems': 'Distributed Systems',
  'discrete-math': 'Discrete Mathematics',
  'basics': 'Basics',
  'programming-questions': 'Programming Questions',
  'react': 'React',
  'spring-boot': 'Spring Boot',
  'sql': 'SQL'
}
