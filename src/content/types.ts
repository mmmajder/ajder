export type LinkItem = { label: string; href: string };

export type SideQuest = {
  date: string;
  title: string;
  description: string;
  tags: string[];
  links: LinkItem[];
};

export type Project = {
  slug: string;
  id: string;
  title: string;
  summary: string;
  role: string;
  period: string;
  system: string;
  systems: string[];
  challenge: string;
  challengeTitle: string;
  built: string;
  builtTitle: string;
  decisions: string[];
  decisionsTitle: string;
  noteLabel: string;
  note: string;
  links: LinkItem[];
};
