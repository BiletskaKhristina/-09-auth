import type { Metadata } from "next";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";

interface Props {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = params;

  const note = await fetchNoteById(id);

  return {
    title: `${note.title} | NoteHub`,
    description: note.content,
    openGraph: {
      title: `${note.title} | NoteHub`,
      description: note.content,
      url: `https://notehub.com/notes/${id}`,
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
}

export default async function NoteDetailsPage({
  params,
}: Props) {
  const { id } = params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}