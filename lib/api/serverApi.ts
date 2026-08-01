import { cookies } from "next/headers";
import { api } from "./api";

import type { Note } from "@/types/note";
import type { User } from "@/types/user";

// =====================
// NOTES (SERVER)
// =====================

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async ({
  page = 1,
  search = "",
  tag,
}: {
  page?: number;
  search?: string;
  tag?: string;
} = {}): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();

  const params: Record<string, string | number> = {
    page,
    perPage: 12,
  };

  if (search) params.search = search;
  if (tag) params.tag = tag;

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};

export const fetchNoteById = async (id: string) => {
  const cookieStore = await cookies();

  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};

// =====================
// AUTH
// =====================

export const checkSession = async () => {
 const response = await api.get("/auth/session");

 return response;
};


// =====================
// USER
// =====================

export const getMe = async () => {
  const cookieStore = await cookies();

  const { data } = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};