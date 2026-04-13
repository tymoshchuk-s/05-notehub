import css from './App.module.css';
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList'
import Loader from '../Loader/Loader';
import Error from '../Error/Error'
import Pagination from "../Pagination/Pagination";
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';


export default function App() {

  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error, isError } = useQuery({
        queryKey: ['notes', page, searchQuery],
        queryFn: () => fetchNotes(page, searchQuery),
        placeholderData: keepPreviousData,    
  });

  const handleSearch = useDebouncedCallback((value) => {
  setSearchQuery(value);
  setPage(1);
}, 300);

  const totalPages = data?.totalPages;
  const notes = data?.notes ?? [];
  
  
  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox text={searchQuery} onSearch={handleSearch}/>
		{totalPages && totalPages > 1 && (
          <Pagination
          pageCount={totalPages}
          currentPage={page}
          onPageChange={setPage}
          />
        )}
          <button onClick={() => setIsOpen(true)} className={css.button}>Create note +</button>
          {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm onClose={() => setIsOpen(false)}/>
        </Modal>
)}
        </header>
        {isLoading && <Loader/>}
        {isError && error && <Error message={error.message}/>}
        {notes.length > 0 && (
          <NoteList notes={notes} />
        )}
</div>
    </>
  )
}

