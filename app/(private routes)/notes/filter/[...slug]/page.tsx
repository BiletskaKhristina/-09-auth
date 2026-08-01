import type { Metadata } from "next";
import {
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import { getQueryClient } from "@/lib/queryClient";
import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";

interface Props {
  params: {
    slug: string[];
  };
}

// SEO
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const filter = params.slug?.join(", ") || "all";

  return {
    title: `Notes: ${filter}`,
    description: `Filtered notes by ${filter}`,
  };
}

export default async function NotesPage({
  params,
}: Props) {
  const tag =
    params.slug?.[0] === "all"
      ? undefined
      : params.slug?.[0];

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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}