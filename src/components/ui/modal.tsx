"use client"
import Link from 'next/link'
import { Button } from './button'
import { motion, AnimatePresence } from 'framer-motion';
import { Close_Outline } from '../Icons';

interface ModalProps {
  children: React.ReactNode;
  closeHref?: string;
}

export function Modal({ children, closeHref = '/' }: ModalProps) {

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 1, y: '100px' }}
        animate={{ opacity: 1, scale: 1, y: '0px' }}
        exit={{ opacity: 0, scale: 0.9, y: '100px' }} // تعديل الحركة عند الخروج
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          mass: 1,
          duration: 0.8,
        }}
        className={`fixed w-full h-full top-0 bottom-0 left-0 right-0 bg-white/30 backdrop-blur-md z-10`}
      >
        <div className='w-full max-w-5xl'>
          <Link href={closeHref} className='absolute top-5 right-5 z-20 p-2'>
            <Button
              variant={'default'}
              size='icon'
              className={`rounded-full hover:bg-popover-foreground bg-stone-800/70 backdrop-blur-md`}
              aria-label="Close Modal"
            >
              <Close_Outline />
            </Button>
          </Link>
        </div>

        <div className='overflow-auto overflow-x-hidden w-full h-full'>
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
