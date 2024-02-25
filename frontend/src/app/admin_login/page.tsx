import React from "react";
import AdminAuthForm from "@/components/auth/AdminAuthForm";

export default function Admin_Login() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-black">ADMIN LOGIN</h1>
      <div className="pt-10">
        <AdminAuthForm />
      </div>
    </div>
  );
}
