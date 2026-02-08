import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.send("This is from users/");
});

export { router };
