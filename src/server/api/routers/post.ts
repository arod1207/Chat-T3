import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  addPost: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.create({
        data: {
          message: input,
          author: {
            connect: {
              id: ctx.session.user.email || undefined,
            },
          },
        },
      });
      return post;
    }),

  getAllPost: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
