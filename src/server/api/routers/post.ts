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
        limit: z.number().min(1).max(15).default(10),
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
  // Get Users Post//
  getUserPost: protectedProcedure.query(async ({ ctx }) => {
    const userPost = await ctx.prisma.post.findMany({
      where: {
        author: {
          id: ctx.session.user.id,
        },
      },
    });
    return userPost;
  }),

  //Delete User Post//
  deleteUserPost: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const deletedPost = await ctx.prisma.post.delete({
        where: {
          id: input,
        },
      });
      return deletedPost;
    }),
  //Like a post//
  likePost: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const likedPost = await ctx.prisma.post.findUnique({
        where: {
          id: input,
        },
      });
      return likedPost;
    }),
});
