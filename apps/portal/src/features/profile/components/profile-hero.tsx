"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Camera, Loader2, Mail, School, Settings, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { roleAccent } from "@/components/layout/header/header-data";
import type { PortalRole } from "@/components/layout/roles/portal-config";
import { useAuthStore } from "@/core/auth/store/auth.store";
import { cn } from "@/lib/utils";

import { getAccountErrorMessage } from "@/features/account-settings/lib/api-error";

import { PHOTO_ACCEPT, profilePhotoService, validatePhoto } from "../services/profile-photo.service";

const statusLabels: Record<string, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  LOCKED: "Locked",
  SUSPENDED: "Suspended",
  ARCHIVED: "Archived",
};

/** Cover banner, avatar with photo editing, and the user's identity. */
export function ProfileHero({ role }: { role: PortalRole }) {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  // Free the preview URL when it is replaced or the page unmounts.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  if (!user) return null;

  const accent = roleAccent[role];
  const fullName = [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" ");
  const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || "U";
  const photoUrl = preview?.url ?? user.profile_picture;
  const active = user.status === "ACTIVE";

  function onPick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow picking the same file again
    if (!file) return;

    const error = validatePhoto(file);
    if (error) {
      toast.error(error);
      return;
    }
    setPreview({ file, url: URL.createObjectURL(file) });
  }

  async function savePhoto() {
    if (!preview || !user) return;
    setSaving(true);
    try {
      const url = await profilePhotoService.upload(preview.file);
      const latest = useAuthStore.getState().user ?? user;
      setUser({ ...latest, profile_picture: url });
      setPreview(null);
      toast.success("Profile photo updated");
    } catch (err) {
      toast.error(getAccountErrorMessage(err, "Couldn't update your photo. Please try again."));
    } finally {
      setSaving(false);
    }
  }

  async function removePhoto() {
    if (!user) return;
    setRemoving(true);
    try {
      await profilePhotoService.remove();
      const latest = useAuthStore.getState().user ?? user;
      setUser({ ...latest, profile_picture: null });
      toast.success("Profile photo removed");
    } catch (err) {
      toast.error(getAccountErrorMessage(err, "Couldn't remove your photo. Please try again."));
    } finally {
      setRemoving(false);
    }
  }

  return (
    <section aria-label="Profile" className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      {/* Cover */}
      <div aria-hidden className="h-24 border-b bg-muted/60 sm:h-28" />

      <div className="px-5 pb-6 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            {/* Avatar */}
            <div className="relative -mt-14 w-fit sm:-mt-16">
              <div className="size-28 overflow-hidden rounded-full bg-muted shadow-lg ring-4 ring-card sm:size-32">
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoUrl} alt={fullName} className="size-full object-cover" />
                ) : (
                  <span className="flex size-full items-center justify-center text-3xl font-semibold text-muted-foreground">
                    {initials}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                aria-label="Choose a new photo"
                className="absolute right-1 bottom-1 flex size-9 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow transition-transform hover:scale-105"
              >
                <Camera className="size-4" />
              </button>
              <input
                ref={inputRef}
                type="file"
                accept={PHOTO_ACCEPT.join(",")}
                className="hidden"
                onChange={onPick}
              />
            </div>

            {/* Identity */}
            <div className="min-w-0 sm:pb-1">
              <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{fullName}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", accent.badge)}>
                  <span className={cn("size-1.5 rounded-full", accent.dot)} />
                  {accent.label}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                    active ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground",
                  )}
                >
                  <BadgeCheck className="size-3.5" />
                  {statusLabels[user.status] ?? user.status}
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {user.school && (
                  <span className="inline-flex items-center gap-1.5">
                    <School className="size-4" />
                    {user.school.name}
                  </span>
                )}
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <Mail className="size-4 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 sm:pb-1">
            {preview ? (
              <>
                <Button type="button" onClick={savePhoto} disabled={saving}>
                  {saving ? <Loader2 className="animate-spin" /> : <BadgeCheck />}
                  {saving ? "Saving…" : "Save photo"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setPreview(null)} disabled={saving}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
                  <Upload />
                  {user.profile_picture ? "Change photo" : "Upload photo"}
                </Button>
                {user.profile_picture && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={removePhoto}
                    disabled={removing}
                    aria-label="Remove photo"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    {removing ? <Loader2 className="animate-spin" /> : <Trash2 />}
                  </Button>
                )}
                <Link href={`/${role}/settings`} className={buttonVariants({ variant: "ghost" })}>
                  <Settings />
                  Account settings
                </Link>
              </>
            )}
          </div>
        </div>

        {preview && (
          <p className="mt-4 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            Previewing your new photo — save to apply it. JPG, PNG or WEBP, up to 5 MB.
          </p>
        )}
      </div>
    </section>
  );
}
