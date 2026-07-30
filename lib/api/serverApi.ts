import { cookies } from "next/headers";
import { api } from "./api";

import type { Note } from "@/types/note";
import type { User } from "@/types/user";


// =====================
// NOTES
// =====================

export const fetchNotes = async () => {
  const cookieStore = await cookies();

  const { data } = await api.get<Note[]>("/notes", {
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
  const cookieStore = await cookies();

  const { data } = await api.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
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