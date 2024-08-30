import { Chat_bubble_oval_left_Outline, Heart_Outline } from "@/components/Icons";
import Love_BTN from "@/components/Screens/Love_BTN";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/Card";
import { Modal } from "@/components/ui/modal";
import { createClient } from "@/lib/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

import type { Metadata } from 'next'

type Props = {
  params: { id: any }
  searchParams: { [key: string]: any | any[] | any | undefined }
}



export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const id = params.id;

  try {
    const supabase = createClient();

    const { data: studio, error } = await supabase
      .from("studios")
      .select("title,description,website,tags,image,gallery,avatar")
      .eq("id", id)
      .single();

    if (error || !studio) {
      console.error("Studio fetch error:", error);
      return { title: "Studio not found" };
    }


    return {
      title: studio?.title || "Studio Details",
      description: studio?.description,
      keywords: [studio.tags],
      generator: 'منصة تصاميم',
      applicationName: 'منصة تصاميم',
      referrer: 'origin-when-cross-origin',
      metadataBase: new URL('https://tasamim.co'),
      themeColor: `#ffffff`,
      twitter: {
        card: 'summary_large_image',
        title: studio?.title,
        description: studio?.description,
        site: '@tasamimco',
        creator: '@tasamimco',
        images: [`https://slcxhoelsccxiuwegpom.supabase.co/storage/v1/object/public/image/studio/${studio?.avatar || `0`}`],  // صورة واحدة فقط
      },
      openGraph: {
        title: studio?.title || 'منصة تصاميم',
        description: studio?.description || "تصاميم اول منصة لعرض التصميمات و الاعمال",
        url: 'https://nextjs.org',
        siteName: 'منصة تصاميم',
        images: studio.gallery.map((image: any) => ({
          url: `https://slcxhoelsccxiuwegpom.supabase.co/storage/v1/object/public/image/studio/${image.image}`,
          width: 800,
          height: 600,
        })),
        locale: 'ar_EG',
        type: 'website',
      },
    };
  } catch (err) {
    console.error("Metadata generation error:", err);
    return { title: "Error generating metadata" };
  }
}



export default async function ScreenModal({
  params: { id: photoId },
}: {
  params: { id: string };
}) {
  try {
    const supabase = createClient();
    let { data: studio, error } = await supabase
      .from("studios")
      .select("*, profiles (avatar_url,username), love (profile,screen)")
      .eq("id", photoId)
      .single();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error fetching studios:", error);
      return <p>Error fetching data.</p>;
    }


    return (
      <Modal>
        <div className='fixed lg:top-24 lg:right-5 z-30 max-lg:bottom-2 max-lg:w-full flex justify-center'>
          <div className="flex justify-evenly bg-white/70 backdrop-blur-md rounded-2xl items-center p-2 w-11/12">
            <div className="max-sm:hidden lg:hidden w-full"><p className="flex text-lg px-2">hello w oijeligjsak loi jgosandlk kjgdnkj</p></div>
            <div className='flex lg:flex-col justify-evenly items-center gap-2 max-sm:w-full'>
              <Link href={`/p/${studio?.profiles?.username}`}>
                <Button variant={'default'} size='icon' className={`rounded-full hover:bg-popover-foreground`}>
                  <Image src={studio?.profiles?.avatar_url} alt={studio?.title} width={50} height={50} className="rounded-full" />
                </Button>
              </Link>
              <Love_BTN studioId={studio.id} userId={user?.id} />
              <Button variant={'outline'} size='icon' className={`rounded-full hover:bg-primary-foreground flex justify-center items-center`}>
                <Chat_bubble_oval_left_Outline className={`size-7 duration-150`} />
              </Button>
              <Button variant={'default'} size='icon' className={`rounded-full hover:bg-popover-foreground`}>
                <Heart_Outline className={`size-7 duration-150`} />
              </Button>
            </div>
          </div>
        </div>
        <Card studio={studio} />
      </Modal>
    );
  } catch (error) {
    console.log(`000000000000`)
  }
}
