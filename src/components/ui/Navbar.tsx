import Link from 'next/link'
import AuthButton from './AuthButton'
import Image from 'next/image'
import Favicon from '@/app/favicon.ico'

export default function Navbar() {
    return (
        <nav className='w-full flex justify-center items-center sticky top-0 z-10'>
            <section className='w-full flex justify-between items-center bg-black'>
                <div className='max-w-7xl w-full bg-white flex justify-between items-center py-2 px-4'>
                    <AuthButton />
                    <Link href={`/`} className='tasamim flex justify-center items-center gap-2'>
                        تصاميم
                        <Image src={Favicon} alt='Favicon tasamim.co' className='w-9 h-9' width={1024} height={1024}/>
                    </Link>
                </div>
            </section>
        </nav>
    )
}
