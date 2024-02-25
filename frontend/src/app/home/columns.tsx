import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Row } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
export type BooksRow = Row<Books>;

export type Books = {
    id: string;
    title: string;
    author: string;
    genre: string;
    published_year: string;
    available_copies: string;
};

export const columns: ColumnDef<Books>[] = [
  {
    accessorKey: 'id',
    header:  ({column}) => {
        return (
            <Button variant="ghost"
            onClick={()=> column.toggleSorting(column.getIsSorted() === "asc")}
            >
                ID
                <ArrowUpDown className='ml-2 h-4 w-4'/>
            </Button>
        )
    },
  },
  {
    accessorKey: 'title',
    header: ({column}) => {
      return (
          <Button variant="ghost"
          onClick={()=> column.toggleSorting(column.getIsSorted() === "asc")}
          >
              TITLE
              <ArrowUpDown className='ml-2 h-4 w-4'/>
          </Button>
      )
    },
  },
  {
    accessorKey: 'author',
    header: ({column}) => {
      return (
          <Button variant="ghost"
          onClick={()=> column.toggleSorting(column.getIsSorted() === "asc")}
          >
              AUTHOR
              <ArrowUpDown className='ml-2 h-4 w-4'/>
          </Button>
      )
    },
  },
  {
    accessorKey: 'genre',
    header: ({column}) => {
      return (
          <Button variant="ghost"
          onClick={()=> column.toggleSorting(column.getIsSorted() === "asc")}
          >
              GENRE
              <ArrowUpDown className='ml-2 h-4 w-4'/>
          </Button>
      )
    },
  },
  {
    accessorKey: 'published_year',
    header: ({column}) => {
      return (
          <Button variant="ghost"
          onClick={()=> column.toggleSorting(column.getIsSorted() === "asc")}
          >
              PUBLISHED_YEAR
              <ArrowUpDown className='ml-2 h-4 w-4'/>
          </Button>
      )
    },
  },
  {
    accessorKey: 'available_copies',
    header: ({column}) => {
      return (
          <Button variant="ghost"
          onClick={()=> column.toggleSorting(column.getIsSorted() === "asc")}
          >
              AVAILABLE COPIES
              <ArrowUpDown className='ml-2 h-4 w-4'/>
          </Button>
      )
    },
  },
  {
    accessorKey: 'book',
    header: 'ACTION',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        className="bg-black text-white hover:bg-black hover:text-white"
        onClick={() => handleBorrow(row.original.id,row.original.title)}
      >
        <Link href="/book">Borrow</Link>
      </Button>
    ),
  },
];

const handleBorrow = (id: string,title :string) => {
  localStorage.setItem('bookId', id);
  localStorage.setItem('bookTitle', title);
};
