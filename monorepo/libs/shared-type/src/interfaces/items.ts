export interface IItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateItem {
  name: string;
}

export interface IUpdateItem {
  name?: string;
}
