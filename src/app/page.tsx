import Cacontainer from "@/components/cacontainer";
import { createClient } from "@/lib/utils/supabase/server";

// Create a single supabase client for interacting with your database

export default async function Home() {
  const supabase = createClient();
  // Fetch studios data from Supabase
  let { data: studios, error } = await supabase.from("studios").select("*").limit(19);

  if (error) {
    console.error("Error fetching studios:", error);
    return <p>Error fetching data.</p>;
  }


  return (
    <main className="flex flex-col items-center w-full">
      <section className="flex flex-col justify-between items-center w-full max-w-7xl *:bg-secondary p-5">
        <div className="w-11/12 rounded-xl p-10">
          <h1 className="text-6xl font-medium text-center mb-5 max-md:text-4xl">شارك تصاميمك</h1>
          <h1 className="text-xl font-normal text-center">تصاميم، حيث يجتمع الإبداع</h1>
        </div>
      </section>

      <section className="flex flex-wrap w-full max-w-7xl *:p-2">
        {studios?.map((studio: any, index: number) => (
          <Cacontainer studio={studio} key={index} />
        ))}
      </section>
    </main>
  );
}
