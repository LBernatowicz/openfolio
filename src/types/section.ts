export interface SectionSize {
  width: number; // 1-4 jednostki szerokości
  height: number; // 1+ jednostek wysokości
}

export interface SectionConfig {
  component: React.ComponentType;
  size: SectionSize;
}

export interface ProjectEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  comments: Comment[];
  status?: 'completed' | 'in-progress' | 'planned';
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  parentId?: string; // dla odpowiedzi na komentarze
  likes: number;
  isLiked?: boolean;
  avatar?: string; // URL awatara użytkownika
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnailImage: string;
  mainImage: string;
  entries: ProjectEntry[];
  technologies: string[];
  status: 'completed' | 'in-progress' | 'planned';
  githubUrl?: string;
  liveUrl?: string;
  comments: Comment[];
}


