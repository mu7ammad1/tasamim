"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import defalut from "@/components/tasamim.webp";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import DialogAuth from "@/components/ui/DialogAuth";
import { Input } from "@/components/ui/input";
import { Publish_Outline } from "@/components/Icons";
import { createClient } from "@/lib/utils/supabase/client";
import imageCompression from "browser-image-compression";
import { useRouter } from 'next/navigation'

type Block = {
  id: number;
  type: "image" | "text";
  content: string;
};

export default function Editor({ userId }: { userId: any }) {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 1, type: "image", content: defalut.src },
  ]);
  const [title, setTitle] = useState(``)
  const [avatar, setAvatar] = useState(``)
  const [description, setDescription] = useState(``)
  const [website, setWebsite] = useState(``)
  const [tags, setTags] = useState(``)

  const supabase = createClient();
  const Router = useRouter()

  const handleAddBlock = (index: number, type: "image" | "text") => {
    const newBlock: Block = {
      id: Date.now(),
      type,
      content: "",
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

  const handleTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const newText = e.target.value;
    setBlocks((prevBlocks) => {
      const updatedBlocks = [...prevBlocks];
      updatedBlocks[index].content = newText;
      return updatedBlocks;
    });
  };

  const convertToWebPBlob = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const webpBlob = await imageCompression.getFilefromDataUrl(
        await imageCompression.getDataUrlFromFile(compressedFile),
        "image/webp"
      );
      return webpBlob;
    } catch (error) {
      console.error("Error converting image to webp:", error);
      throw error;
    }
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
      };
      reader.readAsDataURL(file); // This will trigger the conversion to Base64
    }
  };

  const handlePublish = async () => {
    let imageUrl = null;
    let avatarUrl = null;

    if (avatar) {
      try {
        const blob: any = await fetch(avatar).then((res) => res.blob());
        const webpBlob = await convertToWebPBlob(blob);
        const fileName = `studio/${Date.now()}`;

        const { error: uploadError } = await supabase.storage
          .from("image")
          .upload(fileName, webpBlob, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
        } else {
          const { data: publicUrlData, error: urlError }: any =
            supabase.storage.from("image").getPublicUrl(fileName);

          if (urlError) {
            console.error("URL fetch error:", urlError);
          } else {
            avatarUrl = publicUrlData?.publicUrl || null;
          }
        }
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }

    const uploadedImages = await Promise.all(
      blocks
        .filter((block) => block.type === "image" && block.content)
        .map(async (block) => {
          try {
            const blob: any = await fetch(block.content).then((res) =>
              res.blob()
            );
            const webpBlob = await convertToWebPBlob(blob);
            const fileName = `studio/${block.id}_${Date.now()}`;

            const { error: uploadError } = await supabase.storage
              .from("image")
              .upload(fileName, webpBlob, {
                cacheControl: "3600",
                upsert: false,
              });

            if (uploadError) {
              console.error("Upload error:", uploadError);
              return null;
            }

            const { data: publicUrlData, error: urlError }: any =
              supabase.storage.from("image").getPublicUrl(fileName);

            if (urlError) {
              console.error("URL fetch error:", urlError);
              return null;
            }

            return publicUrlData?.publicUrl || null;
          } catch (error) {
            console.error("Error processing image:", error);
            return null;
          }
        })
    );

    const { data, error } = await supabase
      .from("studios")
      .insert([
        {
          title: title,
          gallery: uploadedImages.filter((url) => url !== null),
          description: description,
          website: website,
          image: imageUrl, // Use the uploaded image URL
          tags: tags,
          avatar: avatarUrl,
          user_id: userId,
        },
      ])
      .select();

    if (error) {
      console.error("Insert error:", error);
    } else {
      console.log("Data inserted successfully:", data);
      Router.push(`/`)
    }
  };


  return (
    <main className="flex flex-col gap-5 w-full justify-center h-full px-3">
      <section className="w-full fixed bottom-3 left-0 right-0 flex justify-center items-center">
        <div className="bg-secondary/70 p-1 w-10/12 rounded-full backdrop-blur-full flex justify-center items-center gap-2">
          <DialogAuth
            Data={
              <p
                className="rounded-3xl"
              >
                نشر
              </p>
            }
            Title={`نشر`}
            Description={
              <div className="flex flex-col gap-3">
                <p>Description</p>
                <Textarea
                  placeholder="عنوان"
                  className="rounded-xl text-right"
                  dir="auto"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Button
                  variant={"default"}
                  size={"default"}
                  className="rounded-3xl w-full"
                  onClick={handlePublish}
                >
                  نشر
                </Button>
              </div>
            }
          />
          <Button variant={"default"} size={"default"} className="rounded-3xl">
            <Publish_Outline className={`text-secondary w-6 h-6`} />
          </Button>
          <Input
            placeholder="عنوان"
            className="rounded-full text-right"
            dir="auto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </section>
      <section className="w-full flex justify-center h-full my-10">
        <section className="w-full max-w-5xl flex flex-col justify-center items-center">
          <p>Avatar</p>
          <Input type="file" onChange={handleAvatar} placeholder="Upload & Update image" />
          {avatar && (
            <Image src={avatar} alt="Preview" width={1024} height={1024} className="h-72 object-cover" />
          )}
          <Separator className="w-full" />
          {blocks.map((block, index) => (
            <React.Fragment key={block.id}>
              {block.type === "image" ? (
                <>
                  {block.content ? (
                    <div className="hover:border-2 border-2 border-spacing-7 border-white hover:border-secondary rounded-2xl p-2">
                      <DialogAuth
                        Data={
                          <Image
                            src={block.content}
                            alt={`image_${index + 1}`}
                            className="rounded-2xl"
                            width={1024}
                            height={1024}
                          />
                        }
                        Title={
                          <ImageUploadButton
                            index={index}
                            handleImageUpload={handleImageUpload}
                          />
                        }
                        Description={
                          <Image
                            src={block.content}
                            alt={`image_${index + 1}`}
                            className="rounded-2xl max-h-96 object-cover"
                            width={1024}
                            height={1024}
                          />
                        }
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
                  placeholder="Text Here"
                />
              )}
              <AddNewBlock
                onAddImage={() => handleAddBlock(index, "image")}
                onAddText={() => handleAddBlock(index, "text")}
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
      <Button variant={"outline"} onClick={handleButtonClick}>
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
    <Button
      variant={"outline"}
      size={"default"}
      className="rounded-full"
      onClick={onAddImage}
    >
      Add Image
    </Button>
    <Button
      variant={"outline"}
      size={"default"}
      className="rounded-full ml-2"
      onClick={onAddText}
    >
      Add Text
    </Button>
  </div>
);
