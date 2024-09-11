"use client";

import { Input } from "@/components/ui/input";
import { constants } from "@/lib/constants";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const searchParamsOptions = constants.searchParams;

type SearchKeyAllowed =
  (typeof searchParamsOptions)[keyof typeof searchParamsOptions];

export const SearchBox = ({
  searchKey,
  placeholder,
}: {
  searchKey: SearchKeyAllowed;
  placeholder: string;
}) => {
  const searchParams = useSearchParams();
  const searchQ = searchParams.get(searchKey) ?? "";
  const [searchQuery, setSearchQuery] = useState(searchQ ?? "");

  useEffect(() => {
    if (searchQ === "" && searchQuery !== "") {
      setSearchQuery("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQ]);

  const [timeout, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const generatePathWithSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    return `${location.pathname}?${params.toString()}`;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const serachQuery = e.target.value;
    const path = generatePathWithSearchParam(searchKey, serachQuery);

    if (timeout) {
      clearTimeout(timeout);
    }
    const newTimeout = setTimeout(() => {
      router.push(path);
    }, 500);
    setTimeoutId(newTimeout);
    setSearchQuery(serachQuery);
  };

  return (
    <Input
      onChange={handleSearch}
      value={searchQuery}
      placeholder={placeholder}
      className="rounded-full mx-[2px] bg-background"
    />
  );
};
