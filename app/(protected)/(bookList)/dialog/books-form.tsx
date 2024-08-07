"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supaclient/client";
import {
  AttritbutesList,
  bookSchema,
  type Books,
  type BookUpdateForm,
} from "@/models";
import { AttributesRepository } from "@/repositories/attributes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AttributeSelector } from "./components/attribute-selector";

type BookFormProps = {
  book: Partial<Books>;
  loadingState: boolean;
  onClose: () => void;
  onSaved: (book: BookUpdateForm) => void;
};

export const BookForm = ({
  book,
  loadingState: isLoading,
  onClose,
  onSaved,
}: BookFormProps) => {
  const supabase = createClient();
  const attributesRepo = useMemo(
    () => new AttributesRepository(supabase),
    [supabase]
  );

  const [attributes, setAttributes] = useState<AttritbutesList>();
  const [bookAttributes, setBookAttributes] = useState<string[]>([]);

  const bookForm = useForm<BookUpdateForm>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book.title ?? "",
      uuid: book.uuid ?? "",
      id: book.id ?? -1,
      attributes:
        bookAttributes && bookAttributes.length > 0 ? bookAttributes : [""],
      deleted_attributes: [],
    },
  });

  useEffect(() => {
    attributesRepo.getAttributes().then((data) => {
      setAttributes(data);
      if (book.uuid) {
        attributesRepo.getBookAttributes(book.uuid).then((data) => {
          const _bookAttributes = data.map((d) => d.uuid);
          setBookAttributes(_bookAttributes);
          bookForm.setValue("attributes", _bookAttributes);
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributesRepo, book.uuid]);

  const onSubmit = async (values: BookUpdateForm) => {
    let _attributes =
      values.attributes?.filter(
        (attr) => !bookAttributes?.includes(attr) && attr !== ""
      ) ?? [];

    const updatedValues = {
      ...values,
      attributes: _attributes,
      deleted_attributes:
        bookAttributes?.filter((attr) => !values.attributes?.includes(attr)) ??
        [],
    };

    onSaved(updatedValues);
  };

  return (
    <div className="flex flex-col gap-4">
      <Form {...bookForm}>
        <form
          id="manage-book-form"
          className="flex flex-col gap-4"
          onSubmit={bookForm.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col">
            <FormField
              control={bookForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul buku</FormLabel>
                  <FormControl>
                    <Input placeholder="Judul buku" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            key={(attributes?.length ?? -99).toString()}
            control={bookForm.control}
            name="attributes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <div className="flex justify-between items-center">
                    <p>Atribut</p>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const newAttributes = field.value
                          ? [...field.value]
                          : [];
                        newAttributes.push("");
                        field.onChange(newAttributes);
                      }}
                    >
                      <i className="bx bx-plus" />
                    </Button>
                  </div>
                </FormLabel>
                <AttributeSelector field={{ ...field }} />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="flex justify-end gap-3">
        <Button
          onClick={onClose}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          Batal
        </Button>
        <Button
          form="manage-book-form"
          type="submit"
          size="sm"
          className="rounded-full"
          disabled={isLoading}
        >
          Simpan
          {isLoading && (
            <i className="bx bx-loader animate-loading ml-2 text-white" />
          )}
        </Button>
      </div>
    </div>
  );
};
