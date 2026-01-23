export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
  createdAt: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  sections?: Section[];
}

export interface Section {
  id: string;
  pageId: string;
  type: 'HERO' | 'TEXT' | 'IMAGE' | 'CTA' | 'FAQ';
  order: number;
  content: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  createdAt: string;
}

export interface Menu {
  id: string;
  name: string;
  location: string;
  items?: MenuItem[];
}

export interface MenuItem {
  id: string;
  menuId: string;
  label: string;
  url: string;
  order: number;
  parentId?: string;
  children?: MenuItem[];
}
