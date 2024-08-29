import Cacontainer from "@/components/cacontainer";
import Follow_BTN from "@/components/Screens/Follow_BTN";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/Card";
import { createClient } from "@/lib/utils/supabase/server";
import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  try {
    const supabase = createClient();
    let { data: profiles, error } = await supabase
      .from("profiles")
      .select("username,full_name,avatar_url,website,bio,work")
      .eq("username", params.slug)
      .single();

    if (error || !profiles) {
      console.error("profiles fetch error:", error);
      return { title: "profiles not found" };
    }

    return {
      title: profiles?.full_name || "profiles Details",
      description: profiles?.bio,
      twitter: {
        card: "summary_large_image",
        title: profiles?.full_name,
        description: profiles?.bio,
        site: "@tasamimco",
        creator: "@tasamimco",
        images: [profiles.avatar_url], // صورة واحدة فقط
      },
      openGraph: {
        title: profiles?.full_name || "منصة تصاميم",
        description:
          profiles?.bio || "تصاميم اول منصة لعرض التصميمات و الاعمال",
        url: "https://nextjs.org",
        siteName: "منصة تصاميم",
        images: {
          url: profiles.avatar_url,
          width: 800,
          height: 600,
        },
        locale: "ar_EG",
        type: "profile",
      },
    };
  } catch (err) {
    console.error("Metadata generation error:", err);
    return { title: "Error generating metadata" };
  }
}
export default async function Page({ params, searchParams }: Props) {
  const supabase = createClient();

  let { data: profiles, error } = await supabase
    .from("profiles")
    .select("*, studios (*)")
    .eq(`username`, params.slug)
    .single();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (error) {
    <div>Somthing Wrong</div>;
  }

  return (
    <main>
      <section className="flex flex-col justify-center items-center gap-3">
        <Image
          src={profiles?.avatar_url}
          alt="avatar"
          width={1024}
          height={1024}
          className="w-32 h-32 object-cover rounded-full"
        />
        <h1 className="text-3xl font-medium">{profiles?.full_name}</h1>
        <div className="flex justify-center items-center gap-3" dir="rtl">
          {profiles?.username && <p>{profiles?.username}@</p>}
          {profiles?.work && <p>{profiles?.work}</p>}
        </div>
        <div className="flex flex-col justify-center items-center gap-5">
          {profiles?.website && <p>{profiles?.website}</p>}
          {profiles?.bio && <p>{profiles?.bio}</p>}
          <Follow_BTN />
        </div>
        <main className="flex flex-col items-center w-full mt-3">
          <section className="flex flex-wrap w-full max-w-7xl *:p-2">
            {profiles.studios?.map((studio: any, index: number) => (
              <Cacontainer studio={studio} key={index} />
            ))}
          </section>
        </main>
      </section>
    </main>
  );
}
