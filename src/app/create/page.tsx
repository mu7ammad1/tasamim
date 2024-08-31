import { createClient } from '@/lib/utils/supabase/server';
import Editor from './Editor'

export default async function Create_Page() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className='w-full'>
      <Editor userId={user?.id} />
    </main>
  )
}
