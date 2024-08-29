import { createClient } from "@/lib/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return (
    <div className="flex items-center gap-4 w-full">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center rounded-full bg-primary px-5 py-2 text-primary-foreground">
          <span>عرض القائمة</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-2xl shadow-none mt-2 *:mt-3 *:*:my-1">
          <Link
            href="/create"
          >
            <Button variant={"secondary"} size={"default"} className="w-full hover:bg-blue-500 rounded-full">
              نشر مشروعك
            </Button>
          </Link>
          <Link
            href="/login"
          >
            <Button variant={"secondary"} size={"default"} className="w-full hover:bg-blue-500 rounded-full">
              signup
            </Button>
          </Link>
          <Link
            href="/login"
          >
            <Button variant={"secondary"} size={"default"} className="w-full hover:bg-blue-500 rounded-full">
              signup
            </Button>
          </Link>
          {!user?.id &&
            <div>
              <Link
                href="/signup"
                className="w-full flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
              >
                <Button variant={"secondary"} size={"default"} className="w-full hover:bg-blue-500 rounded-2xl">
                  تسجيل حساب جديد
                </Button>
              </Link>
              <Link
                href="/login"
                className="w-full flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
              >
                <Button variant={"secondary"} size={"default"} className="w-full hover:bg-blue-500 rounded-2xl">
                  تسجيل دخول
                </Button>
              </Link>
            </div>
          }
          {user?.id &&
            <form action={signOut}>
              <Button variant={"destructive"} size={"default"} className="text-left hover:bg-blue-500 rounded-xl w-full flex justify-start">
                Logout
                <br />
                {user?.email}
              </Button>
            </form>
          }
        </DropdownMenuContent>
      </DropdownMenu>


    </div>
  )
}