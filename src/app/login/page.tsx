import { LoginForm } from "@/features/auth/auth.index";

function page() {
  return (
    <div className="px-4 flex flex-col h-screen justify-center items-center">
      <LoginForm />
    </div>
  );
}

export default page;
