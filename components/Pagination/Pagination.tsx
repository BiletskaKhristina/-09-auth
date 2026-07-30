import ReactPaginate from 'react-paginate';


import css from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const safePageCount = Math.max(1, Number.isFinite(pageCount) ? pageCount : 1);
  const forcePage = Math.max(0, Math.min(currentPage - 1, safePageCount - 1));

  return (
    <ReactPaginate
      className={css.pagination}
      pageCount={safePageCount}
      forcePage={forcePage}
      onPageChange={(e) => onPageChange(e.selected + 1)}
      previousLabel="Prev"
      nextLabel="Next"
    />
  );
}