import css from './NoteList.module.css';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';

interface NoteListProps {
    notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
const [deletingId, setDeletingId] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            setDeletingId(null);
        },
        onError() {
            console.log('error')
            setDeletingId(null);
        },
    });
    
    const handleDelete = (id: string) => {
  setDeletingId(id);
  deleteMutation.mutate(id);
};


    return (
        <>
            <ul className={css.list}>
                {notes.map((note) => (
                    <li key={note.id} className={css.listItem}>
                        <h2 className={css.title}>{ note.title }</h2>
                        <p className={css.content}>{note.content}</p>
                        <div className={css.footer}>
                            <span className={css.tag}>{note.tag}</span>
                            <button
                                onClick={() => handleDelete(note.id)}
                                className={css.button}
                                disabled={deletingId === note.id}
                            >
                                {deletingId === note.id ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </li>))}
            </ul>
        </>
    )
}