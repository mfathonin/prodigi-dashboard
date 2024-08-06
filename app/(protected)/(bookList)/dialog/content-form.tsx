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
import { getLinks } from "@/lib/utils";
import { contentSchema, ContentUpdateForm } from "@/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { toCanvas } from "qrcode";
import { useEffect, useRef, useState } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";

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

  const form = useForm<ContentUpdateForm>({
    resolver: zodResolver(contentSchema),
    defaultValues: content,
  });

  const onSubmit = async (data: ContentUpdateForm) => {
    await onSaved(data);
  };

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
      form.handleSubmit(onSubmit)();
    }
  };

  const label = {
    bookId: "Buku",
    title: "Judul",
    targetUrl: "Target URL",
    path: "Link",
  };

  const errors = form.formState.errors;
  const errorKeys = Object.keys(errors);
  const hasError = errorKeys.length > 0;

  return (
    <div>
      <Form {...form}>
        {!form.formState.isValid && hasError && (
          <div className="bg-red-100 text-red-500 p-2 rounded-md mb-4">
            <p className="font-semibold mb-1">Terdapat kesalahan input:</p>
            <ul>
              {errorKeys.length > 0 &&
                errorKeys.map((key) => (
                  <li key={key} className="text-sm">
                    <p>
                      {label[key as keyof typeof label]}:{" "}
                      {
                        form.formState.errors[key as keyof typeof errors]
                          ?.message
                      }
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        )}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 "
        >
          <div className="grid w-full grid-cols-5 space-x-4">
            {/* Editor */}
            <div className="col-span-3 flex flex-col gap-y-3">
              <FormField
                control={form.control}
                name="path"
                render={({ field }) => <AliasEditor field={field} />}
              />
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
                        onChange={(e) => {
                          e.stopPropagation();
                          e.preventDefault();

                          if (content.linkId === -1) {
                            const path = generatePath(e.target.value);
                            form.setValue("path", path, {
                              shouldValidate: true,
                            });
                          }
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konten URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://contoh.com/link-tujuan"
                        {...field}
                        onKeyDown={onEnterKey}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* QR Preview */}
            <div className="col-span-2 flex flex-col gap-4 items-center justify-center">
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

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                onClose();
              }}
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

const generatePath = (title: string) => {
  const today = new Date();
  let dateStr = today.toISOString().replace(/[-:T]/g, "").slice(2, 14);

  const dateNumb = parseInt(dateStr);
  dateStr = dateNumb.toString(36);

  const len = title.length;
  const ret = `${dateStr}-${title
    .toLocaleLowerCase()
    .slice(0, len > 30 ? 30 : len)
    .replace(/\s/g, "-")}`;

  return ret.toLocaleLowerCase();
};
