"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addAttribute } from "../actions";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AttributeForm() {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const keyInput = useRef<HTMLInputElement>(null);
  const valueInput = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await addAttribute(new FormData(event.currentTarget));
      toast.success("Atribut berhasil ditambahkan", {
        description: `Atribut ${key}: ${value} telah ditambahkan`,
      });
      setValue("");

      router.refresh();
      setTimeout(() => {
        valueInput.current?.focus();
      }, 400);
    } catch (error) {
      console.error(1349, "Error add attribute details:", { error });
      toast.error("Gagal menambahkan atribut", {
        description: (error as Error)?.message
          ? (error as Error).message
          : "Terjadi kesalahan dalam menambahkan atribut",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (keyInput.current && keyInput.current.value == "") {
      keyInput.current.focus();
    } else if (valueInput.current) {
      valueInput.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-center">
      <label htmlFor="key">Key</label>
      <Input
        ref={keyInput}
        type="text"
        name="key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Key"
        required
        className="flex-1"
        disabled={isLoading}
      />
      <label htmlFor="value">Value</label>
      <Input
        ref={valueInput}
        type="text"
        name="value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Value"
        required
        className="flex-1"
        disabled={isLoading}
      />
      <Button type="submit" size="sm" disabled={isLoading || !key || !value}>
        {isLoading ? (
          <>
            <i className="bx bx-loader animate-spin mr-2" />
            Menambahkan...
          </>
        ) : (
          <>
            <i className="bx bx-plus text-lg mr-2" />
            Tambah
          </>
        )}
      </Button>
    </form>
  );
}
