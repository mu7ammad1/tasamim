"use client";
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import defalut from '@/components/tasamim.webp';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import DialogAuth from '@/components/ui/DialogAuth';
import { Input } from '@/components/ui/input';

type Block = {
  id: number;
  type: 'image' | 'text';
  content: string;
};

export default function Editor() {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 1, type: 'image', content: defalut.src },
  ]);

  const handleAddBlock = (index: number, type: 'image' | 'text') => {
    const newBlock: Block = {
      id: Date.now(),
      type,
      content: type === 'image' ? '' : '',
    };

    setBlocks((prevBlocks) => {
      const updatedBlocks = [...prevBlocks];
      updatedBlocks.splice(index + 1, 0, newBlock);
      return updatedBlocks;
    });
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result as string;
        setBlocks((prevBlocks) => {
          const updatedBlocks = [...prevBlocks];
          updatedBlocks[index].content = newImage;
          return updatedBlocks;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const newText = e.target.value;
    setBlocks((prevBlocks) => {
      const updatedBlocks = [...prevBlocks];
      updatedBlocks[index].content = newText;
      return updatedBlocks;
    });
  };

  return (
    <main className="flex flex-col gap-5 w-full justify-center h-full">
      <section className='w-full fixed bottom-3 left-0 right-0 flex justify-center items-center'>
        <div className='bg-secondary/70 p-1 w-10/12 rounded-full backdrop-blur-full flex justify-center items-center gap-5'>
          <Button variant={'secondary'} size={'default'} className='rounded-full'>Hello</Button>
          <Input placeholder='عنوان' className='rounded-full text-right' dir='auto' />
        </div>
      </section>
      <section className="w-full flex justify-center h-full my-10">
        <section className="w-full max-w-5xl flex flex-col justify-center items-center">
          {blocks.map((block, index) => (
            <React.Fragment key={block.id}>
              {block.type === 'image' ? (
                <>
                  {block.content ? (
                    <div className='hover:border-2 border-2 border-spacing-7 border-white hover:border-secondary rounded-2xl p-2'>
                      <DialogAuth Data={<Image
                        src={block.content}
                        alt={`image_${index + 1}`}
                        className="rounded-2xl"
                        width={1024}
                        height={1024}
                      />}
                        Title={<ImageUploadButton
                          index={index}
                          handleImageUpload={handleImageUpload}
                        />}
                        Description={<Image
                          src={block.content}
                          alt={`image_${index + 1}`}
                          className="rounded-2xl max-h-96 object-cover"
                          width={1024}
                          height={1024}
                        />}
                      />
                    </div>
                  ) : (
                    <ImageUploadButton
                      index={index}
                      handleImageUpload={handleImageUpload}
                    />
                  )}
                </>
              ) : (
                <Textarea
                  value={block.content}
                  onChange={(e) => handleTextChange(e, index)}
                  className="w-full p-2 border text-lg font-medium rounded-xl"
                  minLength={10}
                  placeholder='Text Here'
                />
              )}
              <AddNewBlock
                onAddImage={() => handleAddBlock(index, 'image')}
                onAddText={() => handleAddBlock(index, 'text')}
              />
            </React.Fragment>
          ))}
        </section>
      </section>
    </main>
  );
}

const ImageUploadButton = ({
  index,
  handleImageUpload,
}: {
  index: number;
  handleImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, index)}
        ref={fileInputRef}
        className="hidden"
      />
      <Button variant={'outline'} onClick={handleButtonClick}>
        Upload Image
      </Button>
    </div>
  );
};

const AddNewBlock = ({
  onAddImage,
  onAddText,
}: {
  onAddImage: () => void;
  onAddText: () => void;
}) => (
  <div className="p-1 w-full flex justify-center items-center my-10">
    <Separator className={`p-[1px] w-full max-w-md`} />
    <Button variant={'outline'} size={'default'} className="rounded-full" onClick={onAddImage}>
      Add Image
    </Button>
    <Button variant={'outline'} size={'default'} className="rounded-full ml-2" onClick={onAddText}>
      Add Text
    </Button>
    <Separator className={`p-[1px] w-full max-w-md`} />
  </div>
);
