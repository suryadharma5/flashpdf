"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { axiosInstance } from "@/lib/axios";
import { TUpdateProfileSchema, updateProfileSchema } from "@/lib/types/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Camera, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type EditProfileModalProps = {
  open: boolean;
  setOpen: (val: boolean) => void;
  username: string;
  imageUrl: string;
};

export default function EditProfileModal({
  open,
  setOpen,
  username: oldUsername,
  imageUrl,
}: EditProfileModalProps) {
  const [avatarUrl, setAvatarUrl] = useState(imageUrl);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isChanged, setIsChanged] = useState(false);

  const form = useForm<TUpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      image: null,
      username: oldUsername,
    },
  });

  const handleSubmit = async (data: TUpdateProfileSchema) => {
    if (data.username === oldUsername) {
      data.username = null;
    }

    updateProfileMutation.mutate(data);
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (data: TUpdateProfileSchema) => {
      const formData = new FormData();

      if (data.image) {
        formData.append("image", data.image);
      }

      if (data.username) {
        formData.append("username", data.username);
      }

      const res = await axiosInstance.patch("/api/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    },
    onSuccess: () => {
      form.reset();
      setOpen(false);
      toast.success("Profile update!", {
        duration: 3000,
      });
    },
    onError: (e: CustomError) => {
      console.log(e.response?.data.status);

      if (e.response?.data.status === 409) {
        toast.error("Username already existed!");
      } else {
        toast.error("Failed to update profile, please try again!");
      }
    },
  });

  const watchUsername = form.watch("username");

  useEffect(() => {
    setAvatarUrl(imageUrl);
    setAvatarFile(null);
    setIsChanged(false);
    form.reset();
    updateProfileMutation.reset();
  }, [open]);

  useEffect(() => {
    const hasUsernameChanged = watchUsername !== oldUsername;
    const hasImageChanged = !!avatarFile;

    setIsChanged(hasUsernameChanged || hasImageChanged);
  }, [watchUsername, avatarFile, oldUsername]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-2 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-6 py-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl} alt="Profile picture" />
                    <AvatarFallback>
                      {oldUsername.toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="avatar-upload"
                            className="cursor-pointer"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                              <Camera className="h-4 w-4" />
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="avatar-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                e.preventDefault();

                                const file = e.target.files?.[0] as File;
                                field.onChange(file);

                                if (file && file instanceof File) {
                                  setAvatarFile(file);
                                  const objectUrl = URL.createObjectURL(file);
                                  setAvatarUrl(objectUrl);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Click the camera icon to upload a new photo
                </div>
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value || oldUsername}
                          placeholder="Your username"
                          className={`${updateProfileMutation.isError ? "border-red-800" : ""} py-1`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending || !isChanged}
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
