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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { constants } from "@/lib/constants";
import { getLinks } from "@/lib/utils";
import { contentSchema, ContentType, ContentUpdateForm } from "@/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { toCanvas } from "qrcode";
import { useEffect, useRef, useState } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import {
  onNumberValueChange,
  onSubmit,
  onTitleChange,
  parseErrors,
  resetFormOnTypeChange,
} from "./handler";

const {
  CONTENT: { OPTIONS_LABEL },
} = constants;

type ContentFormProps = {
  content: Partial<ContentUpdateForm>;
  loadingState: boolean;
  onClose: () => void;
  onSaved: (content: ContentUpdateForm) => void | Promise<void>;
};

export const ContentForm = ({
  content,
  loadingState: isLoading,
  onClose,
  onSaved,
}: ContentFormProps) => {
  const qrCanvas = useRef<HTMLCanvasElement>(null);
  const isEditing = content.id !== -1;

  const form = useForm<ContentUpdateForm>({
    resolver: zodResolver(contentSchema),
    defaultValues: { ...content, type: "content" },
  });

  const path = form.watch("path");
  const generatedUrl = path !== "" ? getLinks(path) : undefined;

  useEffect(() => {
    if (qrCanvas.current != null && generatedUrl) {
      toCanvas(qrCanvas.current, generatedUrl, { width: 130, margin: 2 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCanvas, generatedUrl]);

  const onEnterKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit((data) => onSubmit(data, onSaved))();
    }
  };

  const { errors, hasError } = parseErrors(form.formState.errors);

  return (
    <div>
      <Form {...form}>
        {!form.formState.isValid && hasError && (
          <div className="bg-red-100 text-red-500 p-2 rounded-md mb-4">
            <p className="font-semibold mb-1">Terdapat kesalahan input:</p>
            <ul>
              {errors.map((error) => (
                <li key={error.key} className="text-sm">
                  <p>
                    {error.label}: {error.message}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <form
          onSubmit={form.handleSubmit((data) => onSubmit(data, onSaved))}
          className="flex flex-col gap-4 "
        >
          <Tabs
            defaultValue="content"
            onValueChange={(val) => {
              resetFormOnTypeChange(form, val as ContentType);
            }}
          >
            <div className="grid w-full grid-cols-5 gap-x-4">
              {/* Editor */}
              <div className="col-span-5 mb-6 md:col-span-3 md:mb-0 flex flex-col gap-y-3">
                {!isEditing && (
                  <TabsList className="md:hidden">
                    <TabsTrigger className="w-full" value="content">
                      Link
                    </TabsTrigger>
                    <TabsTrigger className="w-full" value="quiz">
                      Kuis
                    </TabsTrigger>
                  </TabsList>
                )}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul konten</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Judul konten"
                          {...field}
                          onKeyDown={onEnterKey}
                          onChange={onTitleChange(form, field)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <TabsContent value="content" className="m-0">
                  <FormField
                    control={form.control}
                    name="targetUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konten URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://contoh.com/link-tujuan"
                            onKeyDown={onEnterKey}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="h-[68px] w-full"></div>
                </TabsContent>
                <TabsContent value="quiz" className="flex flex-col m-0 gap-y-3">
                  <div className="flex gap-x-3 w-full">
                    <FormField
                      control={form.control}
                      name="nQuestion"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Jumlah soal</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              onChange={onNumberValueChange(field)}
                              placeholder="Jumlah soal"
                              inputMode="numeric"
                              type="number"
                              min={1}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nOptions"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Jumlah opsi</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              placeholder="Jumlah opsi"
                              inputMode="numeric"
                              type="number"
                              onChange={onNumberValueChange(field)}
                              min={2}
                              max={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <OptionViewer nOptions={form.watch("nOptions") ?? 0} />
                </TabsContent>
                <Separator className="mt-2" />
                <FormField
                  control={form.control}
                  name="path"
                  render={({ field }) => <AliasEditor field={field} />}
                />
              </div>

              {/* QR Preview */}
              <div className="col-span-5 md:col-span-2 flex flex-col gap-y-4 px-2 items-end w-full">
                {!isEditing && (
                  <TabsList className="hidden md:block">
                    <TabsTrigger value="content">Link</TabsTrigger>
                    <TabsTrigger value="quiz">Kuis</TabsTrigger>
                  </TabsList>
                )}
                <div className="w-full flex flex-col gap-4 items-center justify-start">
                  <canvas
                    ref={qrCanvas}
                    className="border border-opacity-30 size-[130px] rounded-md"
                  />
                  <div className="">
                    <p className="text-center font-semibold text-sm">
                      QR Code Preview
                    </p>
                    <p className="text-center text-xs text-wrap">
                      {generatedUrl ?? "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="ml-2"
              disabled={isLoading || !form.formState.isDirty}
            >
              Simpan
              {isLoading && (
                <i className="bx bx-loader animate-loading ml-2 text-white" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const AliasEditor = ({
  field,
}: {
  field: ControllerRenderProps<ContentUpdateForm, "path">;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <FormItem>
      <FormLabel>Link konten</FormLabel>
      <div className="flex gap-x-3">
        <FormControl>
          <Input
            placeholder="VWXYZ-alamat-pendek-kontent"
            {...field}
            readOnly={!isEditing}
            disabled={!isEditing}
            onChange={(e) => {
              e.stopPropagation();
              e.preventDefault();

              e.target.value = e.target.value.replace(/\s/g, "-");
              field.onChange(e);
            }}
          />
        </FormControl>
        <Button
          size="icon"
          variant={isEditing ? "secondary" : "outline"}
          className="shrink-0 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsEditing((prev) => !prev);
          }}
        >
          <i
            className={`bx ${
              isEditing ? "bx-check text-green-600" : "bx-edit"
            } text-lg`}
          />
        </Button>
      </div>
      <FormMessage />
    </FormItem>
  );
};

const selectedOptionStyle =
  "bg-green-500 hover:bg-green-500 text-white hover:text-white flex-1";
const defaultOptionStyle = "hover:bg-zinc-100 flex-1";

const OptionViewer = ({ nOptions }: { nOptions: number }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSelect = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedOption(index);
  };

  let viewer: React.ReactNode = (
    <p className="text-xs w-full text-center opacity-60">
      Mohon isi jumlah opsi jawaban
    </p>
  );

  if (nOptions === 2)
    viewer = (
      <>
        <Button
          variant="outline"
          className={
            selectedOption === 0 ? selectedOptionStyle : defaultOptionStyle
          }
          onClick={handleSelect(0)}
        >
          Benar
        </Button>
        <Button
          variant="outline"
          className={
            selectedOption === 1 ? selectedOptionStyle : defaultOptionStyle
          }
          onClick={handleSelect(1)}
        >
          Salah
        </Button>
      </>
    );

  if (nOptions > 2 && nOptions <= 5)
    viewer = (
      <>
        {Array.from({ length: nOptions }).map((_, i) => (
          <Button
            variant="outline"
            className={
              selectedOption === i ? selectedOptionStyle : defaultOptionStyle
            }
            key={i}
            onClick={handleSelect(i)}
          >
            {OPTIONS_LABEL[i]}
          </Button>
        ))}
      </>
    );

  return (
    <div className="flex flex-col gap-y-2 justify-between h-[68px]">
      <p className="text-sm">Tampilan Opsi Jawaban</p>
      <div className="flex gap-x-2">{viewer}</div>
    </div>
  );
};
