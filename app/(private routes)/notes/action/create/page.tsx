import type { Metadata } from "next";
import Link from "next/link";

import NoteForm from "@/components/NoteForm/NoteForm";


export const metadata: Metadata = {
  title: "Create note | NoteHub",
  description: "Create a new note in NoteHub",

  openGraph: {
    title: "Create note | NoteHub",
    description: "Create a new note in NoteHub",
    url: "https://notehub.com/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub",
      },
    ],
  },
};


export default function CreatePage() {
  return (
    <main>
      <div>
        <h1>Create note</h1>

        <NoteForm />

        <Link href="/notes">
          ← Back to notes
        </Link>
      </div>
    </main>
  );
}