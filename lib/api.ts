import axios from "axios";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

const api = axios.create({
  baseURL: "https://notehub-api.goit.study",
  withCredentials: true,
});

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

// =====================
// AUTH
// =====================

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post<User>("/auth/login", data);
  return response.data;
};

export const register = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post<User>("/auth/register", data);
  return response.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const getSession = async () => {
  const response = await api.get<User | null>("/auth/session");
  return response.data;
};


// =====================
// USERS
// =====================

export const getMe = async () => {
  const response = await api.get<User>("/users/me");
  return response.data;
};

export const updateMe = async (data: Partial<User>) => {
  const response = await api.patch<User>("/users/me", data);
  return response.data;
};


// =====================
// NOTES
// =====================

export const fetchNotes = async ({
  search = "",
  page = 1,
  tag,
}: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
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

  const response = await api.get<FetchNotesResponse>("/notes", {
    params,
  });

  return response.data;
};


export const fetchNoteById = async (id: string) => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};


export const createNote = async (note: CreateNoteDTO) => {
  const response = await api.post<Note>("/notes", note);
  return response.data;
};


export const deleteNote = async (id: string) => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};