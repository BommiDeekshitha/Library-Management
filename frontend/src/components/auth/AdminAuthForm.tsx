"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { useRouter } from 'next/navigation';


const formSchema = z.object({
    user_name: z.string().min(2,{
        message: "Username should more than 2 characters"
    }),
    pass: z.string().min(2, {
      message: "Password should not be empty.",
    }),
  });
  
  export default function AdminAuthForm() {
      const router = useRouter();
      const form = useForm<z.infer<typeof formSchema>>({
          resolver: zodResolver(formSchema),
          defaultValues: {
            user_name: "",
            pass: "",
          },
        })
        const url = process.env.NEXT_PUBLIC_BACKEND_URL;     
        function onSubmit(values: z.infer<typeof formSchema>) {
            axios.post(`${url}admin_login`,values)
            .then(res=>{
                if(res.status == 200 && res.data == "WELCOME ADMIN"){
                    alert("Welcome Admin!");
                    router.push('/admin');
                }
            }).catch(err=>{
                alert(`Invalid Admin Credentials!`);
            })
        }
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="user_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="henry_doe" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your Username
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
            
          />
          <FormField
            control={form.control}
            name="pass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="*******" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the password
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
            
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    )
  }
