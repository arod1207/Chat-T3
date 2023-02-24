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

  getAllPost: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }
      return {
        posts,
        nextCursor,
      };
    }),
});
