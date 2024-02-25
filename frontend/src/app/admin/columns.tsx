import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Row } from '@tanstack/react-table';
import axios from 'axios';
export type BooksRow = Row<Books>;
import { useRouter } from 'next/router';
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

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
    header: ({column}) => {
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
                PUBLISHED YEAR
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
    accessorKey: 'update',
    header: 'UPDATE',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        className="bg-black text-white hover:bg-black hover:text-white"
        onClick={() => handleUpdate(row.original.id)}
      >
        <Link href="/update">UPDATE</Link>
      </Button>
    ),
  },
  {
    accessorKey:"delete",
    header: "DELETE",
    cell : ({ row }) => (
        <Button variant={"ghost"}
            className='bg-black text-white hover:bg-black hover:text-white'
            onClick={() => handleDelete(row.original.id)}
        > DELETE</Button>
    )
  }
];

const handleUpdate = (id: string) => {
  localStorage.setItem('updatebookId', id);
};

// const router = useRouter();
const handleDelete = (id : string) =>{
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    axios.delete(`${url}delete_book/${id}`)
    .then(res=>{
        if(res.status == 200 && res.data == "Deleted Successfully!"){
            alert("Book Deleted Successfully!");
            window.location.reload();
            // router.reload() ;
        }
    }).catch(err=>{
        alert(`Internal Server Error!`);
    })
}