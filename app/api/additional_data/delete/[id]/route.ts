import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const user = auth()

    if (!user) {
        redirect('/')
    }

    try {
        await deleteAdditionalDate(params.id)
    } catch (error) {
        return Response.json({ message: "Additional dates can't delete" })

    }
}

async function deleteAdditionalDate(id: string) {
    await db.additionalDates.delete({
        where: {
            additonalDateId: id
        }
    })
}