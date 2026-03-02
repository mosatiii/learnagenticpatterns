import { z } from "zod";

export const waitlistSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be under 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  role: z.enum(
    [
      "Senior Developer",
      "Tech Lead",
      "Software Architect",
      "CTO/VP Engineering",
      "Other",
    ],
    { required_error: "Please select your role" }
  ),
  challenge: z
    .string()
    .max(500, "Please keep your response under 500 characters")
    .optional()
    .or(z.literal("")),
});

export type WaitlistFormData = z.infer<typeof waitlistSchema>;
