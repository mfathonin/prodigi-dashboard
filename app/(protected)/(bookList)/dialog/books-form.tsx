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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
                <FormMessage />

                {field.value &&
                  field.value.length > 0 &&
                  field.value.map((value, index) => {
                    if (!attributes) return null;
                    const fieldValues = field.value;
                    if (!fieldValues) return null;

                    return (
                      <div key={index} className="flex gap-2">
                        <AttributeSelector
                          attributes={attributes}
                          value={value}
                          onSelect={(uuid) => {
                            const newAttributes = [...fieldValues];
                            newAttributes[index] = uuid ?? "";
                            field.onChange(newAttributes);
                          }}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const newAttributes = [...fieldValues];
                            newAttributes.splice(index, 1);
                            field.onChange(newAttributes);
                          }}
                        >
                          <i className="bx bx-trash" />
                        </Button>
                      </div>
                    );
                  })}
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

const AttributeSelector = ({
  attributes,
  value: selectedUUID,
  onSelect,
}: {
  attributes: AttritbutesList;
  value?: string;
  onSelect: (uuid?: string) => void;
}) => {
  const attributeKeys = useMemo(
    () => Object.keys(attributes).sort(),
    [attributes]
  );
  const initialKey =
    attributeKeys.find((key) =>
      attributes[key].find((attr) => attr.uuid === selectedUUID)
    ) ?? "";

  const [selectedKey, setSelectedKey] = useState<string>(initialKey);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    selectedUUID
  );

  const listAttributToSelect = useMemo(() => {
    if (!selectedKey) return [];
    return attributes[selectedKey].sort((a, b) =>
      a.value.localeCompare(b.value)
    );
  }, [selectedKey, attributes]);

  useEffect(() => {
    setSelectedKey(initialKey);
    setSelectedValue(selectedUUID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUUID]);

  return (
    <div key={selectedKey ?? ""} className="flex gap-2 w-full">
      <Select
        value={selectedKey}
        onValueChange={(key) => {
          setSelectedKey(key);
          setSelectedValue("");
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={"Pilih satu atribut"}>
            {selectedKey}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {attributeKeys.map((key) => (
            <SelectItem
              key={key}
              value={key}
              onSelect={() => {
                setSelectedKey(key);
              }}
            >
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={selectedValue}
        onValueChange={(uuid) => {
          onSelect(uuid);
          setSelectedValue(uuid);
        }}
        disabled={!selectedKey}
      >
        <SelectTrigger>
          <SelectValue placeholder={"Pilih salah satu"}>
            {listAttributToSelect.find((a) => a.uuid === selectedValue)?.value}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {listAttributToSelect.map((attr) => (
            <SelectItem
              key={attr.uuid}
              value={attr.uuid}
              onSelect={() => {
                setSelectedValue(attr.uuid);
              }}
            >
              {attr.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
