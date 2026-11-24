"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";
import { Pencil, Loader2, Save, X } from "lucide-react";

type ProfileData = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
};

export default function ProfilePage() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notificationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // NOTIFIKASI BERHASIL OTOMATIS HILANG
  const showSuccessNotification = (text: string) => {
    if (notificationTimer.current) {
      clearTimeout(notificationTimer.current);
    }

    setMessage(text);

    notificationTimer.current = setTimeout(() => {
      setMessage("");
      notificationTimer.current = null;
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (notificationTimer.current) {
        clearTimeout(notificationTimer.current);
      }
    };
  }, []);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Gagal mengambil informasi akun. Silakan login kembali.");
      setLoading(false);
      return;
    }

    const userProfile: ProfileData = {
      id: user.id,
      fullName: user.user_metadata?.full_name || "",
      email: user.email || "",
      avatarUrl: user.user_metadata?.avatar_url || "",
      createdAt: user.created_at || "",
    };

    setProfile(userProfile);
    setFullName(userProfile.fullName);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      setError("Nama lengkap tidak boleh kosong.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim(),
      },
    });

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setProfile((prev) =>
      prev ? { ...prev, fullName: fullName.trim() } : prev,
    );

    showSuccessNotification("Profil berhasil diperbarui.");
    setSaving(false);
  };

  const handleUploadAvatar = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file || !profile) return;

    setError("");
    setMessage("");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Format foto harus JPG, PNG, atau WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran foto maksimal 2 MB.");
      event.target.value = "";
      return;
    }

    setUploading(true);

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${profile.id}/avatar-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      event.target.value = "";
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const avatarUrl = `${publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        avatar_url: avatarUrl,
      },
    });

    if (updateError) {
      setError(updateError.message);
      setUploading(false);
      event.target.value = "";
      return;
    }

    setProfile((prev) => (prev ? { ...prev, avatarUrl } : prev));

    showSuccessNotification("Foto profil berhasil diperbarui.");
    setUploading(false);
    event.target.value = "";
  };

  const handleCancel = () => {
    if (!profile) return;

    setFullName(profile.fullName);
    setError("");
    setMessage("");
  };

  const formattedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  if (loading) {
    return (
      <DashboardContainer className="py-10">
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-[#3E729A]" />
        </div>
      </DashboardContainer>
    );
  }

  if (!profile) {
    return (
      <DashboardContainer className="py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error || "Data profil tidak ditemukan."}
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer className="space-y-6 py-8">
      {/* HEADER PROFIL */}
      <section className="rounded-2xl bg-[#111827] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          {/* FOTO PROFIL */}
          <div className="relative shrink-0">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white/10 bg-[#243247] sm:h-28 sm:w-28">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Foto profil"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl font-semibold text-[#8ECAE6]">
                  {profile.fullName.charAt(0).toUpperCase() || "I"}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              aria-label="Ganti foto profil"
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#111827] bg-[#8ECAE6] text-[#111827] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleUploadAvatar}
            />
          </div>

          {/* NAMA DAN EMAIL */}
          <div className="min-w-0 text-center sm:text-left">
            <h2 className="break-words text-2xl font-semibold text-white">
              {profile.fullName || "Pengguna"}
            </h2>

            <p className="mt-1 break-all text-sm text-slate-300">
              {profile.email}
            </p>

            <p className="mt-3 text-xs text-slate-400">
              {uploading
                ? "Sedang mengunggah foto..."
                : "Klik ikon pensil untuk mengganti foto profil."}
            </p>
          </div>
        </div>
      </section>

      {/* NOTIFIKASI */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* INFORMASI PRIBADI */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-7">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-lg font-semibold text-[#111827]">
                Informasi Pribadi
              </h3>
              <p className="mt-0.5 text-sm text-slate-500">
                Perbarui informasi akun kamu.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* NAMA LENGKAP */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Nama Lengkap
            </label>

            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={saving}
              placeholder="Masukkan nama lengkap"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#3E729A] focus:ring-2 focus:ring-[#3E729A]/10 disabled:bg-slate-50"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
            />

            <p className="mt-2 text-xs text-slate-400">
              Email terhubung dengan akun registrasi kamu.
            </p>
          </div>

          {/* TANGGAL BERGABUNG */}
          <div>
            <label
              htmlFor="createdAt"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Tanggal Bergabung
            </label>

            <input
              id="createdAt"
              type="text"
              value={formattedDate}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-6 sm:flex-row">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Batal
          </button>

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={saving || !fullName.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#243247] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </section>
    </DashboardContainer>
  );
}
