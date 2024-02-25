"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

import { Books, columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import Link from 'next/link';

 
const Home = () => {
  const [data, setData] = useState<Books[]>([]);
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  useEffect(() => {
    axios.get<Books[]>(url+"")
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="container">
    <div className="flex justify-end pt-10">
        <Button variant="secondary" size={"lg"} className='bg-black text-white hover:bg-cyan'>
            <Link href='/profile'>PROFILE</Link>
        </Button>
    </div>
    <h1 className="text-3xl font-semibold mb-4">Books</h1>
    <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Home;
