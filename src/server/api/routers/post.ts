import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  addPost: protectedProcedure
    .input(
      z.string({ required_error: "Please add a message!" }).min(1).max(150)
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.create({
        data: {
          message: input,
          author: {
            connect: {
              id: ctx.session.user.id || undefined,
            },
          },
        },
      });
      return post;
    }),

  getAllPost: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  }),
});
