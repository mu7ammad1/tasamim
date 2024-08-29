import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/server";
import { SubmitButton } from "@/components/ui/submit-button";
import Link from "next/link";

export default function Login_Page({
  searchParams,
}: {
  searchParams: { message: string };
}) {

  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/");
  };


  return (
    <div className="flex w-full px-8 justify-center gap-2 items-start mt-16 h-screen">
      <div className="w-2/5 max-sm:w-full max-md:w-2/3">
        <h1 className="text-3xl font-bold mb-12 text-center">مرحبا بعودتك</h1>
        <form className="flex flex-col w-full justify-center gap-2 text-foreground *:rounded-full *:px-4 *:py-2 *:border *:my-2">
          <input
            name="email"
            placeholder="you@example.com"
          />
          <input
            type="password"
            name="password"
            placeholder="••••••••"
          />
          <div className="mb-3 flex justify-end gap-2">
            <Link href={`/reset`} className="text-blue-500 text-sm"> لقد نسيت كلمة المرور </Link>
          </div>
          <SubmitButton
            formAction={signIn}
            className="border border-foreground/20 rounded-md px-4 py-2 text-primary-foreground mb-2 bg-primary"
            pendingText="...تسجيل دخول"
          >
            تسجيل دخول
          </SubmitButton>
          <div className="my-5 flex justify-center items-center gap-2 border-none">
            <Link href={`/signup`} className="text-blue-500"> تسجيل الدخول </Link>
            <p>أليس لديك حساب؟ </p>
          </div>

          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
