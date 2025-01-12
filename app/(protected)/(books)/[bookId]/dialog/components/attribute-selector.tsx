"use client";

import { Button } from "@/components/ui/button";
import { useFormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supaclient/client";
import { AttritbutesList } from "@/models";
import { AttributesRepository } from "@/repositories/attributes";
import { useEffect, useMemo, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import Link from "next/link";

export const AttributeSelector = ({
  field,
}: {
  field?: ControllerRenderProps;
}) => {
  const [attributes, setAttributes] = useState<AttritbutesList>();
  const { error } = useFormField();

  useEffect(() => {
    const supabase = createClient();
    const attributesRepo = new AttributesRepository(supabase);
    attributesRepo.getAttributes().then(setAttributes);
  }, []);

  if (!attributes) return null;

  const fieldValues: string[] = field?.value satisfies Array<string>;
  if (!field || !fieldValues) return null;
  if (fieldValues.length === 0)
    return (
      <div className="text-center">
        <p className="text-opacity-70 w-full text-zinc-400 dark:text-zinc-500 text-sm italic mb-2">
          Klik tombol <i className="bx bx-plus" /> untuk memilih atribut
        </p>
        <Link
          href="/book-attributes"
          className="text-sm text-blue-500 hover:underline"
        >
          Manage Attributes
        </Link>
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      {fieldValues.map((value, index) => {
        const _error = (error as any)?.[index];
        return (
          <div key={index} className="flex gap-2">
            <div className="flex flex-col gap-1 w-full">
              <AttributeSelectorItem
                attributes={attributes}
                value={value}
                onSelect={(uuid) => {
                  const newAttributes = [...fieldValues];
                  newAttributes[index] = uuid ?? "";
                  field.onChange(newAttributes);
                }}
                isError={!!_error}
              />
              {_error && (
                <p
                  className={
                    "text-[0.8rem] font-medium text-red-500 dark:text-red-900"
                  }
                >
                  {_error.message}
                </p>
              )}
            </div>
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
    </div>
  );
};

export const AttributeSelectorItem = ({
  attributes,
  value: selectedUUID,
  onSelect,
  isError,
}: {
  attributes: AttritbutesList;
  value?: string;
  onSelect: (uuid?: string) => void;
  isError?: boolean;
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
          setSelectedValue("");
          onSelect("");
          setTimeout(() => setSelectedKey(key), 50);
        }}
      >
        <SelectTrigger className={isError ? "border-red-500" : ""}>
          <SelectValue placeholder={"Pilih satu atribut"}>
            {selectedKey}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {attributeKeys.length > 0 ? (
            attributeKeys.map((key) => (
              <SelectItem
                key={key}
                value={key}
                onSelect={() => {
                  setSelectedKey(key);
                }}
              >
                {key}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="empty" disabled>
              Tidak ada atribut tersedia
            </SelectItem>
          )}
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
        <SelectTrigger
          className={isError && selectedKey ? "border-red-500" : ""}
        >
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
