"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";


interface Props {
  tag?: string;
}


export default function NotesClient({ tag }: Props) {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);


    return () => clearTimeout(timer);
  }, [search]);


  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };


  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notes", tag, debouncedSearch, page],

    queryFn: () =>
      fetchNotes({
        page,
        search: debouncedSearch,
        tag,
      }),

    refetchOnMount: false,
  });


  if (isLoading) {
    return <p>Loading...</p>;
  }


  if (isError || !data) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong while loading notes.";

    return <p>{errorMessage}</p>;
  }


  return (
    <>
      <SearchBox onSearch={handleSearch} />


      <Link href="/notes/action/create">
        Create note +
      </Link>


      {data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}


      {typeof data.totalPages === "number" &&
        data.totalPages > 0 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={Math.min(page, data.totalPages)}
            onPageChange={(p) =>
              setPage(
                Math.max(
                  1,
                  Math.min(p, data.totalPages)
                )
              )
            }
          />
        )}
    </>
  );
}