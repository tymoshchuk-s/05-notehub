import axios from 'axios';
import type { Note } from '../types/note';

export interface NoteHttpResponse {
    notes: Note[];
    totalPages: number;
}


axios.defaults.baseURL = 'https://notehub-public.goit.study/api';


const token = import.meta.env.VITE_NOTEHUB_TOKEN;

export const fetchNotes = async (page: number, search: string) => {   
  
    const res = await axios.get<NoteHttpResponse>('/notes', {
        params: { page, perPage: 10, search },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}


interface NewNote {
    title: string;
    content: string;
    tag: string;
}

export const createNote = async (newNote: NewNote) => {
    const res = await axios.post<NoteHttpResponse>('/notes', newNote, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}

export const deleteNote = async (id: string) => {
    const res = await axios.delete<NoteHttpResponse>(`/notes/${id}`,  {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}