export interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  seoTitle?: string;
  seoDescription?: string;
  sections?: Section[];
}

export interface Section {
  id: string;
  pageId: string;
  type: 'HERO' | 'TEXT' | 'IMAGE' | 'CTA' | 'FAQ';
  order: number;
  content: Record<string, any>;
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
