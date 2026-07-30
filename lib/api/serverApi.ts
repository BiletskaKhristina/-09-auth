import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";


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


export const getMe = async () => {
  const cookieStore = await cookies();

  const { data } = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};