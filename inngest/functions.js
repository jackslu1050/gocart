// src/inngest/functions.ts
import { inngest } from "./client";
import prisma from "@/lib/prisma"

export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-create", event: "clerk/user.created" },
  
//   async ({ event }) => {
//     const {data}=event
//     console.log(data)
//     const newUser=await prisma.user.create({
//         data:{
//             id:data.id,
//             email:data.email_addresses[0].email_address,
//             name:`${data.first_name} ${data.last_name}`,
//             image: data.image_url,
//         }
//     })
//     return{success:true, user: newUser}
//    }

 async ({ event, step }) => {
    // Extract data from Clerk's event payload
    const { id, email, name, image } = event.data;
    // const primaryEmail = email_addresses?.[0]?.email_address;

    // Use Inngest step to safely execute the Prisma insert
    const newUser = await step.run("insert-user-neon", async () => {
      return await prisma.user.create({
        data: {
          clerkId: id,
          email: email,
          name: name,
          image: image,
        },
      });
      })
    return { success: true, user: newUser };
}
)

export const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update",event: "clerk/user.updated" },
  
  async ({ event }) => {
    const {data}=event
    console.log(data)
    
    await prisma.user.update({
        where:{id:data.id},
        data:{
            email:data.email_addresses[0].email_address,
            name:`${data.first_name} ${data.last_name}`,
            image: data.image_url,
        }
    })
   }
)

export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete",event: "clerk/user.deleted" },
  
  async ({ event }) => {
    const {data}=event
    await prisma.user.delete({
        where:{id:data.id},
    })
   }
)