import type { IItem, ICreateItem, IUpdateItem } from "@gaia/shared-type";
import { apiClient } from "./client";

export async function fetchItems(): Promise<IItem[]> {
  const { data } = await apiClient.get<IItem[]>("/items");
  return data;
}

export async function fetchItem(id: string): Promise<IItem> {
  const { data } = await apiClient.get<IItem>(`/items/${id}`);
  return data;
}

export async function createItem(dto: ICreateItem): Promise<IItem> {
  const { data } = await apiClient.post<IItem>("/items", dto);
  return data;
}

export async function updateItem(
  id: string,
  dto: IUpdateItem,
): Promise<IItem> {
  const { data } = await apiClient.patch<IItem>(`/items/${id}`, dto);
  return data;
}

export async function deleteItem(id: string): Promise<IItem> {
  const { data } = await apiClient.delete<IItem>(`/items/${id}`);
  return data;
}
