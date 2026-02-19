import LoginForm from "@/features/auth/components/login-form";
import React from "react";

function page() {
  return (
    <div className="px-4 flex flex-col h-screen justify-center items-center">
      <LoginForm />
    </div>
  );
}

export default page;
