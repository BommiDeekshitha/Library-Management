"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react";
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
  name: z.string().min(2,{
    message: "Name must be above 2 Characters",
  }),
  email: z.string().email({
    message: "Invalid email format.",
  }),
  password: z.string().min(2, {
    message: "Password should not be empty.",
  }),
});

export default function UserRegistrationForm() {
    const router = useRouter();
    const [successshowAlert, setsuccessShowAlert] = useState(false);
    const [errorshowAlert, seterrorShowAlert] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name:"",
          email: "",
          password: "",
        },
      })
      const url = process.env.NEXT_PUBLIC_BACKEND_URL; 
      function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(url+'signup')
        axios.post(url + "signup", values)
          .then(res => {
            if(res.data == "Registered Successfully!"){
                alert("Account Created Successfully!");
                router.push('/login'); 
            } 
          })
          .catch(error => {
            if (error.response && error.response.status === 401) {
                alert("Email Already in Use")
            }
          });
      }

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Henry Doe" {...field} />
              </FormControl>
              <FormDescription>
                Enter your Name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="henrydoe@gmail.com" {...field} />
              </FormControl>
              <FormDescription>
                Enter your Email
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          
        />
        <FormField
          control={form.control}
          name="password"
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
    </>
  )

}