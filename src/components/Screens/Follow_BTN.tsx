"use client";
import { Heart_Outline } from "../Icons";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { Loader, LucidePersonStanding } from "lucide-react";
import DialogAuth from "../ui/DialogAuth";


export default function Follow_BTN() {
    const supabase = createClient();
    const ScreenID = `f13f7d4f-d29d-4c49-b875-f1c0f8862272`;
    const userId = `4285c5b3-0a40-4576-a29f-8129dd09988f`;

    const [follow, setFollow] = useState<boolean | null>(null);

    useEffect(() => {
        if (!userId || !ScreenID) return;

        const fetchLikeStatus = async () => {
            const { data, error } = await supabase
                .from("follow")
                .select("*")
                .eq("following", userId)
                .eq("follower", ScreenID)
                .limit(1)
                .single(); // Use single() only if you expect one row

            if (error && error.code !== 'PGRST116') { // Check for specific error code
                console.error("Error fetching like status:", error);
                setFollow(false);
            } else if (data) {
                setFollow(true);
            } else {
                setFollow(false); // Handle case where no rows are returned
            }
        };

        fetchLikeStatus();
    }, [ScreenID, supabase, userId]);

    const handleLike = async () => {
        if (follow === null) return;

        const { error } = await supabase
            .from("follow")
            .insert([{ following: userId, follower: ScreenID }]);

        if (error) {
            console.error("Error inserting like:", error);
        } else {
            setFollow(true);
        }
    };

    const handleDeleteLike = async () => {

        if (!userId || !ScreenID) return;
        if (follow === null) return; // Prevent action if still loading

        const { error } = await supabase
            .from("follow")
            .delete()
            .eq("following", userId)
            .eq("follower", ScreenID)
            .single()

        if (error) {
            console.error("Error deleting like:", error);
        } else {
            setFollow(false);
        }
    };

    if (follow === null) {
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
            {!follow ? (
                userId ? (
                    <Button
                        onClick={handleLike}
                        variant={"default"}
                        size="lg"
                        className={`rounded-full flex justify-center items-center text-base`}
                    >
                        Follow
                    </Button>
                ) : (
                    <DialogAuth Data={data} />
                )
            ) : (

                <Button
                    onClick={handleDeleteLike}
                    variant={"destructive"}
                    size="lg"
                    className={`rounded-full flex justify-center items-center text-base`}
                >
                    UnFollow
                </Button>
            )}
        </div>
    );
}
