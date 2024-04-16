import { z } from "zod";

export const CreateWorkSpaceSchema = z.object({
  workSpaceName: z.string(),
  userId: z.number(),
});
