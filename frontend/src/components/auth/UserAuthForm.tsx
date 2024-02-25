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
  email: z.string().email({
    message: "Invalid email format.",
  }),
  password: z.string().min(2, {
    message: "Password should not be empty.",
  }),
});

export default function UserAuthForm() {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      })
      const url = process.env.NEXT_PUBLIC_BACKEND_URL;     
      function onSubmit(values: z.infer<typeof formSchema>) {
        axios.post(url+"login",values)
        .then(res=>{
            if(res.status == 200){
                localStorage.setItem('id',res.data.userId);
                alert("Going In..");
                router.push('/home');
            }
        }).catch(err=>{
            if(err.response.status == 401){
              alert("Invalid Credentials");
            }else{

              alert(`Internal Server Error :${err}`);
            }
        })
      }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
  )
}