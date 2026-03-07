import { z } from "zod";

// Strict RFC 5322-style email: local@domain.tld (2+ char TLD, no odd chars)
const STRICT_EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;

// Patterns commonly used in SQL injection payloads
const SQL_INJECTION_RE =
  /('|--|;|\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|EXEC|EXECUTE|CREATE|TRUNCATE)\b)/i;

/** Rejects strings that contain obvious SQL injection fragments */
function noSqlInjection(fieldName: string) {
  return z.string().refine(
    (val) => !SQL_INJECTION_RE.test(val),
    { message: `${fieldName} contains invalid characters` }
  );
}

/** Strips leading/trailing whitespace and collapses internal runs */
function sanitize(val: string) {
  return val.trim().replace(/\s+/g, " ");
}

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be under 50 characters")
    .transform(sanitize)
    .pipe(noSqlInjection("First name"))
    .pipe(z.string().regex(/^[a-zA-Z\s'-]+$/, "First name can only contain letters, spaces, hyphens, and apostrophes")),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((val) => val.toLowerCase().trim())
    .pipe(z.string().regex(STRICT_EMAIL_RE, "Please enter a real email address (e.g. you@company.com)"))
    .pipe(noSqlInjection("Email")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be under 100 characters"),
  role: z.enum(
    ["Developer", "Product Manager"],
    { required_error: "Please select your track" }
  ),
  agreedToTerms: z
    .literal(true, {
      errorMap: () => ({ message: "You must agree to the Privacy Policy and Terms of Service" }),
    }),
});

export type SignupFormData = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((val) => val.toLowerCase().trim())
    .pipe(z.string().regex(STRICT_EMAIL_RE, "Please enter a real email address"))
    .pipe(noSqlInjection("Email")),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((val) => val.toLowerCase().trim())
    .pipe(z.string().regex(STRICT_EMAIL_RE, "Please enter a real email address"))
    .pipe(noSqlInjection("Email")),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be under 100 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ambassadorSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be under 100 characters")
    .transform(sanitize)
    .pipe(noSqlInjection("Name")),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((val) => val.toLowerCase().trim())
    .pipe(z.string().regex(STRICT_EMAIL_RE, "Please enter a real email address"))
    .pipe(noSqlInjection("Email")),
  channelUrl: z
    .string()
    .min(1, "Channel or profile link is required")
    .max(500, "URL must be under 500 characters")
    .url("Please enter a valid URL")
    .pipe(noSqlInjection("Channel URL")),
  platform: z.enum(["YouTube", "TikTok", "Instagram", "Other"], {
    required_error: "Please select your platform",
  }),
  followerCount: z
    .string()
    .min(1, "Subscriber/follower count is required")
    .max(20, "Must be under 20 characters")
    .regex(/^[\d,.\s]+$/, "Please enter a number (e.g. 5,000)"),
  whyAudience: z
    .string()
    .min(20, "Please write at least 20 characters")
    .max(1000, "Must be under 1000 characters")
    .transform(sanitize)
    .pipe(noSqlInjection("Response")),
});

export type AmbassadorFormData = z.infer<typeof ambassadorSchema>;

export const communityPartnerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be under 100 characters")
    .transform(sanitize)
    .pipe(noSqlInjection("Name")),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((val) => val.toLowerCase().trim())
    .pipe(z.string().regex(STRICT_EMAIL_RE, "Please enter a real email address"))
    .pipe(noSqlInjection("Email")),
  channelUrl: z
    .string()
    .min(1, "Channel or profile link is required")
    .max(500, "URL must be under 500 characters")
    .url("Please enter a valid URL")
    .pipe(noSqlInjection("Channel URL")),
  platform: z.enum(["YouTube", "TikTok", "Instagram", "LinkedIn", "Other"], {
    required_error: "Please select your platform",
  }),
  whyPartner: z
    .string()
    .min(20, "Please write at least 20 characters")
    .max(1000, "Must be under 1000 characters")
    .transform(sanitize)
    .pipe(noSqlInjection("Response")),
});

export type CommunityPartnerFormData = z.infer<typeof communityPartnerSchema>;
