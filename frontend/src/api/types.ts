export type Article = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  views: number;
  shares: number;
  author: {
    id: string;
    name: string;
  }
};

