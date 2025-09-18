export interface SectionSize {
  width: number; // 1-4 jednostki szerokości
  height: number; // 1+ jednostek wysokości
}

export interface SectionConfig {
  component: React.ComponentType;
  size: SectionSize;
}
