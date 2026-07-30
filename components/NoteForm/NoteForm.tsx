"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { createNote, type CreateNoteDTO } from "../../services/notes";
import type { NoteTag } from "../../types/note";
import { useNoteStore } from "@/lib/store/noteStore";

export default function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      clearDraft();

      router.push("/notes/filter/all");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: CreateNoteDTO = {
      title: draft.title,
      content: draft.content,
      tag: draft.tag,
    };

    mutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>

        <input
          id="title"
          value={draft.title}
          onChange={(e) =>
            setDraft({
              title: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label htmlFor="content">Content</label>

        <textarea
          id="content"
          value={draft.content}
          onChange={(e) =>
            setDraft({
              content: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label htmlFor="tag">Tag</label>

        <select
          id="tag"
          value={draft.tag}
          onChange={(e) =>
            setDraft({
              tag: e.target.value as NoteTag,
            })
          }
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div>
        <button
          type="button"
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button type="submit">
          Create note
        </button>
      </div>
    </form>
  );
}