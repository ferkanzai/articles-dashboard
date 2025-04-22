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

export type PaginatedArticlesResponse = {
  data: Array<Article>;
  success: boolean;
  count: number;
  hasNextPage: boolean;
  lastPage: number;
  total: number;
};

export type Author = {
  id: number;
  name: string;
};

export type AuthorsResponse = {
  data: Array<Author>;
  success: boolean;
  count: number;
};
