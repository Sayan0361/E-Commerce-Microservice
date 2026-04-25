// TypeScript types don’t exist at runtime
// But DI needs that type to know UserService needs UserRepository
// reflect-metadata solves this

// reflect-metadata stores hidden metadata like:
// UserService → depends on UserRepository
import "dotenv/config";
import "reflect-metadata";

export * from "./handlers/user.handler";
export * from "./handlers/profile.handler";
export * from "./handlers/cart.handler";
export * from "./handlers/payment.handler";