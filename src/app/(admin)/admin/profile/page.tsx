"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
};

export default function AdminProfilePage() {

  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const router = useRouter();
  
  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const res = await fetch("/api/admin/profile");

    if (!res.ok) {
      alert("Failed to load profile");
      return;
    }

    const data = await res.json();

    setProfile(data.profile || {});
    setLoading(false);
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    const res = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });

    setSaving(false);

    if (res.ok) {
      setEditing(false);
      alert("Profile updated");
      router.refresh();
    } else {
      alert("Failed to update profile");
    }
  }

  if (loading) {
    return <div className="p-10">Loading profile...</div>;
  }

  const isEmpty =
    !profile.firstName &&
    !profile.lastName &&
    !profile.phone;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow rounded-lg">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-semibold">
          Admin Profile
        </h1>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Edit
          </button>
        )}

      </div>

      {/* EMPTY PROFILE */}
      {isEmpty && !editing && (
        <p className="text-gray-500">
          Complete your profile information.
        </p>
      )}

      {/* VIEW MODE */}
      {!editing && !isEmpty && (
        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-gray-500 text-sm">First Name</p>
            <p className="font-medium">{profile.firstName}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Last Name</p>
            <p className="font-medium">{profile.lastName}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Phone</p>
            <p className="font-medium">{profile.phone}</p>
          </div>

        </div>
      )}

      {/* EDIT MODE */}
      {editing && (
        <form onSubmit={updateProfile} className="space-y-4">

          <div>
            <label className="block text-sm mb-1">First Name</label>
            <input
              className="border w-full p-2 rounded"
              value={profile.firstName || ""}
              onChange={(e) =>
                setProfile({ ...profile, firstName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Last Name</label>
            <input
              className="border w-full p-2 rounded"
              value={profile.lastName || ""}
              onChange={(e) =>
                setProfile({ ...profile, lastName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              className="border w-full p-2 rounded"
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3 pt-2">

            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-4 py-2 rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => setEditing(false)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

          </div>

        </form>
      )}

    </div>
  );
}