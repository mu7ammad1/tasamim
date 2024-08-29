import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/server";
import { SubmitButton } from "@/components/ui/submit-button";
import Link from "next/link";

export default function SignUp_Page({
  searchParams,
}: {
  searchParams: { message: string };
}) {


  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;
    const full_name = formData.get("full_name") as string;
    const supabase = createClient();

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (signUpError || !authData.user) {
      return redirect("/login?message=Could not authenticate user");
    }

    // Insert a new profile for the user in the profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: authData.user.id, // Assuming the 'profiles' table uses 'id' as a foreign key to the 'auth' table
        email: authData.user.email, // Store email or any other relevant information
        username: username,
        full_name: full_name
        // Add any other fields necessary for the profiles table
      });

    if (profileError) {
      return redirect("/login?message=Could not create user profile");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <div className="flex w-full px-8 justify-center gap-2 items-start mt-16 h-screen">
      <div className="w-2/5 max-sm:w-full max-md:w-2/3">
        <h1 className="text-3xl font-bold mb-14 text-center">Sigin for Free</h1>
        <form dir="rtl" className="flex flex-col w-full justify-center gap-2 text-foreground *:rounded-full *:px-4 *:py-2 *:border *:my-2">
          <input
            name="email"
            placeholder="you@example.com"
          />
          <input
            name="full_name"
            placeholder="الاسم بالكامل"
          />
          <input
            name="username"
            placeholder="اسم المستخدم"
          />
          <input
            type="password"
            name="password"
            placeholder="••••••••"
          />
          <SubmitButton
            formAction={signUp}
            className="border border-foreground/20 rounded-md px-4 py-2 text-primary-foreground mb-2 bg-primary"
            pendingText="...تسجيل حساب جديد"
          >
            تسجيل حساب جديد
          </SubmitButton>
          <div className="my-5 flex justify-center items-center gap-2 border-none">
            <p>أليس لديك حساب؟ </p>
            <Link href={`/login`} className="text-blue-500"> تسجيل الدخول </Link>
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
