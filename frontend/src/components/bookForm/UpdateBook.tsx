"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react";
import { useEffect } from 'react';
import * as z from "zod"
import axios from "axios";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { RocketIcon } from "@radix-ui/react-icons"
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    title: z.string().min(2,{
        message:"Title must be atleast 2 characters"
    }),
    author: z.string().min(2,{
        message:"Author must be at least 2 characters"
    }),
    genre: z.string().min(2,{
        message: "Genre must be at least 2 characters long",
    }),
    published_year: z.string().min(4,{
        message: "Invalid published year",
    }),
    available_copies: z.string().min(1,{
        message: "Invalid number of copies",
    })
})

export default function UpdateBookForm(){
    const router = useRouter();
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const id = typeof window !== 'undefined' ? localStorage.getItem('updatebookId') : null;
    console.log(id);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        
    });
    useEffect(()=>{
        if (id) {
            axios.get(`${url}book/${id}`)
              .then(res => {
                const book = res.data[0];
                console.log(book);
                form.setValue('title', book.title);
                form.setValue('author', book.author);
                form.setValue('genre', book.genre);
                form.setValue('published_year', book.published_year.toString());
                form.setValue('available_copies', book.available_copies);
              })
              .catch(err => {
                console.error(err);
              });
          }
    }, [id]);

    function onSubmit(values: z.infer<typeof formSchema>){
        axios.put(`${url}update_book/${id}`,values)
        .then(res => {
            if(res.status == 200 && res.data == "Updated Successfully!"){
                alert("Updated Successfully!");
                router.push('/admin');
            }
        }).catch(err=>{
            console.log(err);
            alert(`Internal Server Error :${err}`);
        })
    }

    return(
        <>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} style={{ width: '300px' }}/>
                </FormControl>
                <FormDescription>
                  Enter the book title
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="Author" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the Author Name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <FormControl>
                  <Input placeholder="Genre" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the Genre
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="published_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Published Year</FormLabel>
                <FormControl>
                  <Input placeholder="Published Year" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the Published Year
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="available_copies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Copies</FormLabel>
                <FormControl>
                  <Input placeholder="No of Copies" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the Available Copies
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button type="submit">Update Book</Button>
          </div>
          </form>
          </Form>  
        </>
    )
}