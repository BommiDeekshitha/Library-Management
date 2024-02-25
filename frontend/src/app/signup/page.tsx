import Link from "next/link";
import React from "react";
import UserRegistrationForm from "@/components/auth/UserRegistrationForm";

const SignupPage = () => {
  return (
    <>
      <div className="md:hidden"></div>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium ">
            <div className="rounded-md p-2 text-white text-3xl">Library Master</div>
          </div>
          <div className="relative z-20 mt-auto"></div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
              <p className="text-sm text-muted-foreground">Enter the following details</p>
            </div>
            <UserRegistrationForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
