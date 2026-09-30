import * as z from 'zod';

import { ENROLLMENT_MAX_FILE_BYTES } from './constants';

const fileRequired = (message) =>
  z
    .custom((value) => value instanceof File, { message })
    .refine((file) => file.size <= ENROLLMENT_MAX_FILE_BYTES, {
      message: 'File must be 10 MB or smaller.',
    });

const fileOptional = z
  .custom((value) => value === null || value === undefined || value instanceof File)
  .refine((value) => !value || value.size <= ENROLLMENT_MAX_FILE_BYTES, {
    message: 'File must be 10 MB or smaller.',
  });

export const enrollmentWizardSchema = z
  .object({
    batchEnrollId: z.string().min(1, 'Please select a batch.'),
    learningModeId: z.string().min(1, 'Please select a mode of learning.'),
    branchEnrollId: z.string().min(1, 'Please select a branch.'),
    reviewScheduleId: z.string().min(1, 'Please select a review schedule.'),
    fullName: z.string().trim().min(1, 'Name is required.'),
    aliasName: z.string().trim().min(1, 'Alias name is required.'),
    schoolName: z.string().trim().min(1, 'School name is required.'),
    gender: z
      .string()
      .min(1, 'Please select a gender.')
      .refine((value) => value === 'female' || value === 'male', {
        message: 'Please select a gender.',
      }),
    dateOfBirth: z.string().min(1, 'Date of birth is required.'),
    contactNumber: z.string().trim().min(1, 'Contact number is required.'),
    homeAddress: z.string().trim().min(1, 'Home address is required.'),
    profilePicture: fileRequired('Please upload a recent formal or graduation picture.'),
    honorAwardDiscountId: z.string().min(1, 'Please select an honors/awards/discount option.'),
    discountProof: fileOptional,
    examExperience: z
      .string()
      .min(1, 'Please select your board exam experience.')
      .refine((value) => value === 'first-time' || value === 'retaker', {
        message: 'Please select your board exam experience.',
      }),
    retakerAttempts: z.string(),
    retakerProof: fileOptional,
    paymentProof: fileRequired('Please upload your payment proof.'),
    downpaymentAmount: z.string().trim().min(1, 'Downpayment amount or scholarship type is required.'),
    packageEnrollId: z.string().min(1, 'Please select a package.'),
    signature: fileRequired('Please upload your signature over printed name.'),
    confirmTerms: z.boolean().refine((value) => value === true, {
      message: 'You must confirm the terms before submitting.',
    }),
  })
  .superRefine((values, ctx) => {
    if (values.examExperience === 'retaker') {
      if (!values.retakerAttempts.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please indicate how many times you have taken the board exam.',
          path: ['retakerAttempts'],
        });
      }
    }
  });

export const enrollmentWizardDefaultValues = {
  batchEnrollId: '',
  learningModeId: '',
  branchEnrollId: '',
  reviewScheduleId: '',
  fullName: '',
  aliasName: '',
  schoolName: '',
  gender: '',
  dateOfBirth: '',
  contactNumber: '',
  homeAddress: '',
  profilePicture: null,
  honorAwardDiscountId: '',
  discountProof: null,
  examExperience: '',
  retakerAttempts: '',
  retakerProof: null,
  paymentProof: null,
  downpaymentAmount: '',
  packageEnrollId: '',
  signature: null,
  confirmTerms: false,
};
