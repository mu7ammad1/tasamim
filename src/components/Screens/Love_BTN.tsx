"use client";
import { Heart_Outline } from "../Icons";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { Loader, LucidePersonStanding } from "lucide-react";
import DialogAuth from "../ui/DialogAuth";

const supabase = createClient();

type Props = {
    studioId: string;
    userId: any;
};

export default function Love_BTN({ studioId, userId }: Props) {
    const [liked, setLiked] = useState<boolean | null>(null); // Start with null to indicate loading state

    // Fetch like status when component mounts or studioId changes
    useEffect(() => {
        const fetchLikeStatus = async () => {
            const { data, error } = await supabase
                .from("love")
                .select("id")
                .eq("profile", userId)
                .eq("screen", studioId)
                .single();

            if (error) {
                console.error("Error fetching like status:", error);
                setLiked(false);
            } else {
                setLiked(data ? true : false);
            }
        };

        fetchLikeStatus();
    }, [studioId, userId]);

    const handleLike = async () => {
        if (liked === null) return; // Prevent action if still loading

        const { error } = await supabase
            .from("love")
            .insert([{ profile: userId, screen: studioId }]);

        if (error) {
            console.error("Error inserting like:", error);
        } else {
            setLiked(true);
        }
    };

    const handleDeleteLike = async () => {
        if (liked === null) return; // Prevent action if still loading

        const { error } = await supabase
            .from("love")
            .delete()
            .eq("profile", userId)
            .eq("screen", studioId);

        if (error) {
            console.error("Error deleting like:", error);
        } else {
            setLiked(false);
        }
    };

    if (liked === null) {
        return <Loader className="animate-spin" />; // Show loading state while fetching
    }

    const data = (
        <Button
            variant={"outline"}
            size="icon"
            className={`rounded-full hover:bg-primary-foreground flex justify-center items-center`}
        >
            <Heart_Outline className={`size-7 duration-150 text-gray-500`} />
        </Button>
    );


    return (
        <div className="flex gap-2">
            {!liked ? (
                userId ? (
                    <Button
                        onClick={handleLike}
                        variant={"outline"}
                        size="icon"
                        className={`rounded-full hover:bg-primary-foreground flex justify-center items-center`}
                    >
                        <Heart_Outline className={`size-7 duration-150 text-gray-500`} />
                    </Button>
                ) : (
                    <DialogAuth Data={data} />
                )
            ) : (
                <Button
                    onClick={handleDeleteLike}
                    variant={"outline"}
                    size="icon"
                    className={`rounded-full hover:bg-primary-foreground flex justify-center items-center`}
                >
                    <Heart_Outline
                        className={`size-7 duration-150 fill-rose-500 stroke-1 stroke-rose-500`}
                    />
                </Button>
            )}
        </div>
    );
}
