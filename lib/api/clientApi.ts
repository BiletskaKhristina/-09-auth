import { api } from "@/lib/api/api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";


// =====================
// NOTES
// =====================

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export type CreateNoteDTO = {
  title: string;
  content: string;
  tag: Note["tag"];
};

interface FetchNotesParams {
  search?: string;
  page?: number;
  tag?: string;
}


export const fetchNotes = async ({
  search = "",
  page = 1,
  tag,
}: FetchNotesParams = {}) => {
  const params: Record<string, string | number> = {
    page,
    perPage: 12,
  };

  if (search) {
    params.search = search;
  }

  if (tag && tag !== "all") {
    params.tag = tag;
  }

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params,
  });

  return data;
};


export const fetchNoteById = async (id: string) => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};


export const createNote = async (note: CreateNoteDTO) => {
  const { data } = await api.post<Note>("/notes", note);
  return data;
};


export const deleteNote = async (id: string) => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};


// =====================
// AUTH
// =====================

export const register = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post<User>("/auth/register", data);
  return response.data;
};


export const login = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post<User>("/auth/login", data);
  return response.data;
};


export const logout = async () => {
  await api.post("/auth/logout");
};


export const checkSession = async () => {
  const response = await api.get<User | null>("/auth/session");
  return response.data;
};


// =====================
// USER
// =====================

export const getMe = async () => {
  const response = await api.get<User>("/users/me");
  return response.data;
};


export const updateMe = async (data: {
  username: string;
}) => {
  const response = await api.patch<User>("/users/me", data);
  return response.data;
};