import Image from "next/image";
import Link from "next/link";

export default function Card({ studio, latestStudio }: any) {
  return (
    <div className="w-full flex justify-center">
      <div className="p-5 rounded-lg w-full max-w-5xl mx-4 relative h-full overflow-auto">
        <Image
          alt={`gallery`}
          src={`https://slcxhoelsccxiuwegpom.supabase.co/storage/v1/object/public/image/studio/${studio.avatar}`}
          width={1024}
          height={1024}
          className="w-full max-h-[200px] min-h-[500px] mb-3 rounded-xl object-cover object-center"
        />
        <h1 className="text-2xl font-bold mt-4" dir="rtl">
          {studio.title}
        </h1>
        <p className="text-lg mt-2" dir="auto">
          {studio.description}
        </p>
        <div
          className="text-sm text-gray-500 mt-2 mb-5 flex w-auto"
          dir="rtl"
        >
          <Link href={`https://` + studio.website} target="_blank" className="hover:underline-offset-8 hover:underline w-fit">
            {studio.website}
          </Link>
        </div>

        {studio.gallery.map((gallery: any, index: any) => (
          <Image
            alt={gallery}
            src={`https://slcxhoelsccxiuwegpom.supabase.co/storage/v1/object/public/image/studio/${gallery}`}
            key={index}
            width={1024}
            height={1024}
            className="w-full h-full mb-3 rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}
