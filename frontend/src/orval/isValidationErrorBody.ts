import { z } from 'zod';
import type { ErrorBody } from '@/orval/generated/model/errorBody';

// FieldErrorスキーマ
const FieldErrorSchema = z.object({
  field: z.string(),
  messages: z.array(z.string()),
});

// DetailModelスキーマ
const DetailModelSchema = z.object({
  fieldErrors: z.array(FieldErrorSchema).optional(),
  globalErrors: z.array(z.string()).optional(),
});

// ErrorBodyスキーマ
const ErrorBodySchema = z.object({
  detail: DetailModelSchema.optional(),
});

export const isValidationErrorBody = (error: unknown): error is ErrorBody => {
  const result = ErrorBodySchema.safeParse(error);
  return result.success;
};
