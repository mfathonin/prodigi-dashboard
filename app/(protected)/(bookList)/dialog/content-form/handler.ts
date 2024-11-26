"use client";

import { ContentType, ContentUpdateForm } from "@/models";
import {
  ControllerRenderProps,
  FieldErrors,
  UseFormReturn,
} from "react-hook-form";
import { label } from "./constants";

export const onSubmit = async (
  data: ContentUpdateForm,
  onSaved: (data: ContentUpdateForm) => void | Promise<void>
) => {
  await onSaved(data);
};

export const resetFormOnTypeChange = (
  form: UseFormReturn<ContentUpdateForm>,
  val: ContentType
) => {
  form.setValue("type", val);
  // reset targetUrl
  form.resetField("targetUrl");
  form.clearErrors("targetUrl");
  // reset nQuestion
  form.resetField("nQuestion");
  form.clearErrors("nQuestion");
  // reset nOptions
  form.resetField("nOptions");
  form.clearErrors("nOptions");
};

export const generatePath = (title: string) => {
  const today = new Date();
  let dateStr = today.toISOString().replace(/[-:T]/g, "").slice(2, 14);

  const dateNumb = parseInt(dateStr);
  dateStr = dateNumb.toString(36);

  const len = title.length;
  const ret = `${dateStr}-${title
    .toLocaleLowerCase()
    .slice(0, len > 30 ? 30 : len)
    .replace(/\s/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")}`;

  return ret.toLocaleLowerCase();
};

export const onTitleChange =
  (
    form: UseFormReturn<ContentUpdateForm>,
    field: ControllerRenderProps<ContentUpdateForm, "title">
  ) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const content = form.getValues();

    if (content.linkId === -1) {
      const path = generatePath(e.target.value);
      form.setValue("path", path, {
        shouldValidate: true,
      });
    }
    field.onChange(e);
  };

export const onNumberValueChange =
  (field: ControllerRenderProps<ContentUpdateForm, "nQuestion" | "nOptions">) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    field.onChange(isNaN(val) ? 0 : val);
  };

export const parseErrors = (errors: FieldErrors<ContentUpdateForm>) => {
  const errorKeys = Object.keys(errors).filter((k) =>
    Object.keys(label).includes(k)
  );
  const hasError = errorKeys.length > 0;
  const parsedErrors = errorKeys.map((key) => ({
    key,
    label: label[key as keyof typeof label],
    message: errors[key as keyof typeof errors]?.message,
  }));

  return { errors: parsedErrors, errorKeys, hasError };
};
