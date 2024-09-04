"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useBannerDialog } from "../dialog-context";

const bannerSchema = z.object({
  image: (typeof window === "undefined"
    ? z.any()
    : z.instanceof(FileList)
  ).refine((fl) => fl.length === 1, "Pilih 1 gambar untuk banner"),
  url: z
    .string()
    .min(1, "Link tidak boleh kosong")
    .url("URL tidak valid")
    .regex(
      /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i,
      "URL tidak valid"
    ),
});

type BannerSchema = z.infer<typeof bannerSchema>;

export const Toolbar = () => {
  const router = useRouter();
  const form = useForm<BannerSchema>({
    resolver: zodResolver(bannerSchema),
    reValidateMode: "onChange",
    defaultValues: {
      url: "",
    },
  });

  const [selectedImage, setImage] = useState<string>();
  const { isOpen, setOpen } = useBannerDialog();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileRef = form.register("image");

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const imgFile = e.target.files?.[0];
    if (imgFile) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setImage(fileReader.result as string);
      };
      fileReader.readAsDataURL(imgFile);
    } else {
      setImage(undefined);
    }
    fileRef.onChange(e);
  };

  const onSubmit = async (values: BannerSchema) => {
    setIsSubmitting(true);
    const supabase = createClient();

    try {
      // Upload image to Supabase storage
      const file = values.image[0] as File;
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("banner")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL of the uploaded image
      const {
        data: { publicUrl },
      } = supabase.storage.from("banner").getPublicUrl(fileName);

      // Save banner information to the "banner" table
      const { data: insertData, error: insertError } = await supabase
        .from("banner")
        .insert({
          image: publicUrl,
          url: values.url,
        });

      if (insertError) throw insertError;

      // Refresh the page using router.refresh()
      router.refresh();

      toast.success("Banner Tersimpan", {
        description: "Banner baru berhasil ditambahkan",
      });

      onOpenChange(false);
    } catch (error: Error | any) {
      console.error("Error uploading banner:", error);
      toast.error("Gagal menambahkan banner", {
        description: `error: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setImage(undefined);
    }
  };

  return (
    <div className="flex justify-end gap-4">
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button className="rounded-full" onClick={() => {}}>
            <i className="bx bx-plus text-lg me-2" />
            Tambah
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <Form {...form}>
            <form id="add-banner" onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Tambah Banner Promosi</DialogTitle>
                <DialogDescription>
                  Pilih gambar dengan ratio 16:9 dan tambahkan link untuk banner
                  promosi yang ingin dibuat.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4 py-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <div>
                        <FormLabel>Upload Image</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        {selectedImage ? (
                          <div className="relative group">
                            <AspectRatio ratio={16 / 9}>
                              <Image
                                src={selectedImage}
                                alt="Selected Image"
                                fill
                                className="h-full w-full rounded-md object-cover"
                              />
                            </AspectRatio>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 rounded-full hidden group-hover:flex"
                              onClick={() => {
                                setImage(undefined);
                                form.resetField("image");
                              }}
                            >
                              <i className="bx bx-trash text-lg" />

                              <span className="sr-only">Hapus</span>
                            </Button>
                          </div>
                        ) : (
                          <Input
                            {...fileRef}
                            type="file"
                            multiple={false}
                            accept="image/*"
                            onChange={handleImageChange}
                            className="h-fit file:bg-primary file:border-0 file:px-4 py-2 file:py-2 file:rounded-md file:text-sm hover:file:bg-primary-foreground hover:file:text-primary flex-1"
                          />
                        )}
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link Promosi</FormLabel>
                      <FormControl className="grid gap-3">
                        <Input placeholder="Enter image URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!form.formState.isValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      Menyimpan...
                      <i className="bx bx-loader animate-loading ms-2" />
                    </>
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/**
 * 
 * <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Open Image Picker</Button>
      
 */
