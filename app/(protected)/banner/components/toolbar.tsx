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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import { ChangeEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const bannerSchema = z.object({
  image: z.string(),
  url: z.string(),
});

type BannerSchema = z.infer<typeof bannerSchema>;

export const Toolbar = () => {
  const form = useForm<BannerSchema>({
    resolver: zodResolver(bannerSchema),
  });

  const [selectedImage, setImage] = useState<File>();

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const imgFile = e.target.files?.[0];
    if (imgFile) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setImage(imgFile);
        form.setValue("image", imgFile.name);
      };
      fileReader.readAsDataURL(imgFile);
    } else {
      setImage(undefined);
      form.resetField("image");
    }
  };

  return (
    <div className="flex justify-end gap-4">
      <Dialog defaultOpen>
        <DialogTrigger asChild>
          <Button className="rounded-full" onClick={() => {}}>
            <i className="bx bx-plus text-lg me-2" />
            Tambah
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select Image</DialogTitle>
            <DialogDescription>
              Drag and drop your image here, click to upload, or enter a URL.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedImage ? (
              <div className="relative group">
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={selectedImage.name}
                    alt="Selected Image"
                    fill
                    className="h-full w-full rounded-md object-cover"
                  />
                </AspectRatio>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 hidden group-hover:flex"
                >
                  <i className="bx bx-trash text-lg me-2" />
                  <span className="sr-only">Hapus</span>
                </Button>
              </div>
            ) : (
              <div className="grid gap-3">
                <Label htmlFor="image-upload">Upload Image</Label>
                <div className="flex h-20 items-center">
                  <Input
                    id="image-upload"
                    type="file"
                    onChange={handleImageChange}
                    className="file:bg-primary file:text-primary-foreground file:border-0 file:px-4 file:py-2 file:rounded-md file:font-medium hover:file:bg-primary-foreground hover:file:text-primary flex-1"
                  />
                </div>
              </div>
            )}
            <div className="grid gap-3">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                type="text"
                // value={imageUrl}
                // onChange={handleUrlChange}
                placeholder="Enter image URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
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
