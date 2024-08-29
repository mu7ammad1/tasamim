import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function DialogAuth({ Data, Description, Title }: any) {
    return (
        <Dialog>
            <DialogTrigger>
                {Data}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{Title}</DialogTitle>
                    <DialogDescription>
                        {Description}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
