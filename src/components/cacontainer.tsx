"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';

interface StudioProps {
    studio: {
        id: string;
        title: string;
        website: string;
        description: string;
        image: string;
    };
}




export default function Cacontainer({ studio }: StudioProps) {

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: 'spring', damping: 5, bounce: 0.5 }}
                className="w-full h-96 md:w-1/2 md:h-72 lg:w-1/3 lg:h-72 relative rounded-xl"
            >
                <Link
                    href={`/studio/${studio.id}`}
                    style={{
                        backgroundImage: `url('${studio.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    className="w-full h-full block rounded-3xl hover:bg-fill"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 1 }}
                        whileHover={{ opacity: 1, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full"
                    >
                        <div
                            className="absolute top-0 left-0 flex justify-between items-center w-full"
                        >
                            <h1 className="text-xl font-medium">{studio.title}</h1>
                            <p className='text-sm'>{studio.website}</p>
                        </div>

                        <div
                            className="absolute bottom-0 right-0 flex justify-between items-center w-full p-2 text-sm"
                        >
                            <p dir="auto">{studio.description}</p>
                        </div>
                    </motion.div>
                </Link>
            </motion.div>
        </>
    );
}
