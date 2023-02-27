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
      return await ctx.prisma.post.create({
        data: {
          message: input,
          author: {
            connect: {
              id: ctx.session.user.id || undefined,
            },
          },
        },
      });
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
      const userId = ctx.session?.user.id;
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        include: {
          likes: {
            where: {
              userId,
            },
            select: {
              like: true,
            },
          },
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              likes: true,
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
    .input(z.object({ likeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return await ctx.prisma.like.create({
        data: {
          like: {
            connect: {
              id: input.likeId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
  unlikePost: protectedProcedure
    .input(z.object({ likeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return await ctx.prisma.like.delete({
        where: {
          likeId_userId: {
            likeId: input.likeId,
            userId,
          },
        },
      });
    }),
});
