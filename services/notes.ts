import {
  fetchNotes as fetchNotesApi,
  createNote,
  deleteNote,
  type FetchNotesResponse,
  type CreateNoteDTO,
} from '@/lib/api';

export type NotesResponse = FetchNotesResponse;

export const fetchNotes = fetchNotesApi;
export { createNote, deleteNote, type CreateNoteDTO };
