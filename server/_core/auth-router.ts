import { router, publicProcedure } from "./trpc";
import { z } from "zod";
import {
  registerUser,
  loginUser,
  loginWithGoogle,
  loginWithFacebook,
  logoutUser,
  validateToken,
  updateUserProfile,
} from "./auth-service";

export const authRouter = router({
  /**
   * Registra um novo usuário
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(2),
        password: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return registerUser(input.email, input.name, input.password);
    }),

  /**
   * Login com email e senha
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return loginUser(input.email, input.password);
    }),

  /**
   * Login com Google
   */
  loginWithGoogle: publicProcedure
    .input(
      z.object({
        googleId: z.string(),
        email: z.string().email(),
        name: z.string(),
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return loginWithGoogle(input.googleId, input.email, input.name, input.avatar);
    }),

  /**
   * Login com Facebook
   */
  loginWithFacebook: publicProcedure
    .input(
      z.object({
        facebookId: z.string(),
        email: z.string().email(),
        name: z.string(),
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return loginWithFacebook(input.facebookId, input.email, input.name, input.avatar);
    }),

  /**
   * Logout
   */
  logout: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      return logoutUser(input.userId);
    }),

  /**
   * Valida um token
   */
  validateToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      return validateToken(input.token);
    }),

  /**
   * Atualiza perfil do usuário
   */
  updateProfile: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string().optional(),
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return updateUserProfile(input.userId, {
        name: input.name,
        avatar: input.avatar,
      });
    }),
});
