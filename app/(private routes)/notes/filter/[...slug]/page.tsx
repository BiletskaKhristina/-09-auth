import type { Metadata } from "next";
import {
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import { getQueryClient } from "@/lib/queryClient";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface Props {
  params: Promise<{
    slug: string[];
  }>;
}


// SEO
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const filter = slug?.join(", ") || "all";

  return {
    title: `Notes: ${filter}`,
    description: `Filtered notes by ${filter}`,

    openGraph: {
      title: `Notes: ${filter}`,
      description: `Filtered notes by ${filter}`,
      url: "https://notehub.com/",
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


export default async function NotesPage({
  params,
}: Props) {
  const { slug } = await params;

  const tag =
    slug?.[0] === "all"
      ? undefined
      : slug?.[0];


  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag, "", 1],

    queryFn: () =>
      fetchNotes({
        page: 1,
        search: "",
        tag,
      }),
  });


  return (
    <HydrationBoundary
      state={dehydrate(queryClient)}
    >
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}