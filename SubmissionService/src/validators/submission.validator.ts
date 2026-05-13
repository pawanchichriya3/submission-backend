import { z } from "zod";

export const createSubmissionSchema = z.object({
    problemId: z.string().min(1, "problemId is required"),
    code: z.string().min(1, "code is required"),
    language: z.enum(["cpp", "python"]),
});

export const updateStatusSchema = z.object({
    status: z.enum(["pending", "compiling", "running", "accepted", "wrong_answer"]),
});

export const submissionsQuerySchema = z.object({
    problemId: z.string().min(1).optional(),
});

export type CreateSubmissionDTO = z.infer<typeof createSubmissionSchema>;
export type UpdateStatusDTO = z.infer<typeof updateStatusSchema>;
