import {
  authenticate,
} from "@medusajs/medusa"
import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  MiddlewaresConfig,
  User,
  UserService,
} from "@medusajs/medusa"
import * as cors from 'cors';
import { parseCorsOrigins } from 'medusa-core-utils';

const registerLoggedInUser = async (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  let loggedInUser: User | null = null
  console.log("###req.user", req.user)
  if (req.user && req.user.userId) {
    const userService =
      req.scope.resolve("userService") as UserService
    loggedInUser = await userService.retrieve(req.user.userId)
  }

  req.scope.register({
    loggedInUser: {
      resolve: () => loggedInUser,
    },
  })

  next()
}

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/admin/products",

      middlewares: [
        cors.default({ credentials: true, origin: parseCorsOrigins(process.env.ADMIN_CORS ?? '') }),
        authenticate(),
        registerLoggedInUser],
    },
  ],
}