"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import axios from "axios";
import {
  BadgeCheck,
  Camera,
  Hash,
  Loader2,
  Mail,
  Phone,
  School,
  Trash2,
  Upload,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/core/auth";

import { PHOTO_ACCEPT, profilePhotoService, validatePhoto } from "../services/profile-photo.service";

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ detail?: unknown }>(error)) {
    if (typeof error.response?.data?.detail === "string") return error.response.data.detail;
    if (error.response?.status === 429) return "Too many attempts. Please wait a moment and try again.";
    if (!error.response) return "Unable to reach the server. Check your connection and try again.";
  }
  return fallback;
}

export function ProfilePage() {
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

  const fullName = [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" ");
  const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || "U";
  const photoUrl = preview?.url ?? user.profile_picture;
  const roleName = user.roles[0]?.name ?? "School Admin";

  function onPick(event: ChangeEvent<HTMLInputElement>) {
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
      toast.error(getErrorMessage(err, "Couldn't update your photo. Please try again."));
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
      toast.error(getErrorMessage(err, "Couldn't remove your photo. Please try again."));
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="My profile" description="Your photo and the details on your account." />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Profile photo</CardTitle>
            <p className="text-sm text-muted-foreground">Shown in the header and across Klugance.</p>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="relative">
                <div className="size-32 overflow-hidden rounded-full bg-muted ring-4 ring-background shadow-sm">
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
                  className="absolute right-1 bottom-1 flex size-9 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow transition-transform hover:scale-105"
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

              <div>
                <p className="font-medium">{preview ? "Preview of your new photo" : fullName}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  JPG, PNG or WEBP, up to 5 MB. A square photo works best.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
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
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        {removing ? <Loader2 className="animate-spin" /> : <Trash2 />}
                        Remove
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account details</CardTitle>
            <p className="text-sm text-muted-foreground">Contact the platform team to change these details.</p>
          </CardHeader>

          <CardContent>
            <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
              <Detail icon={UserRound} label="Full name" value={fullName} />
              <Detail icon={BadgeCheck} label="Role" value={roleName} />
              <Detail icon={Mail} label="Email address" value={user.email} />
              <Detail icon={Phone} label="Mobile number" value={user.mobile_number || "—"} />
              <Detail icon={School} label="School" value={user.school?.name ?? "—"} />
              <Detail icon={Hash} label="School code" value={user.school?.code ?? "—"} />
              <Detail icon={BadgeCheck} label="Account status" value={<StatusBadge status={user.status} />} />
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="truncate text-sm font-medium">{value}</dd>
      </div>
    </div>
  );
}
