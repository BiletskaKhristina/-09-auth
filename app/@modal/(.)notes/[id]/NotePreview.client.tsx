"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { fetchNoteById } from "@/lib/api";

import Modal from "@/components/Modal/Modal";

import css from "./NotePreview.module.css";


interface Props {
  id: string;
}


export default function NotePreviewClient({ id }: Props) {

  const router = useRouter();


  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({

    queryKey: [
      "note",
      id,
    ],

    queryFn: () =>
      fetchNoteById(id),

    refetchOnMount: false,

  });



  const handleClose = () => {
    router.back();
  };


  return (
    <Modal onClose={handleClose}>

      <div className={css.container}>

        {isLoading && (
          <p>Loading...</p>
        )}


        {isError && (
          <p>Something went wrong</p>
        )}


        {note && (
          <>
            <h2>
              {note.title}
            </h2>

            <p>
              {note.content}
            </p>

            <p>
              Tag: {note.tag}
            </p>

            <p>
              Created: {note.createdAt}
            </p>
          </>
        )}

      </div>

    </Modal>
  );
}