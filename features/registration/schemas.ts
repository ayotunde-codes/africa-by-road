import { z } from "zod"

export const personalInfoSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  middleName: z.string().optional(),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  dateOfBirth: z.date({
    error: "Date of birth is required.",
  }),
  country: z.string().min(1, { message: "Country is required." }),
  state: z.string().min(1, { message: "State is required." }),
  city: z.string().min(1, { message: "City is required." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
})

export const socialMediaSchema = z.object({
  instagram: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  facebook: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  twitter: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  tiktok: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  youtube: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
})

export const documentUploadSchema = z.object({
  governmentId: z.boolean().refine((val) => val === true, {
    message: "Government ID is required.",
  }),
  proofOfAddress: z.boolean().refine((val) => val === true, {
    message: "Proof of address is required.",
  }),
  medicalRecords: z.boolean().refine((val) => val === true, {
    message: "Medical records are required.",
  }),
})
