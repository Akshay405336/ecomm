"use client";

import { useEffect, useState } from "react";

type Profile = {
  firstName?: string;
  lastName?: string;
  gender?: string;
  dob?: string;
};

export default function ProfilePage() {

  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const res = await fetch("/api/customer/profile");
    const data = await res.json();

    setProfile(data.profile || {});
    setLoading(false);
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    const res = await fetch("/api/customer/profile", {
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
    }
  }

  if (loading) {
    return <div className="p-10">Loading profile...</div>;
  }

  const isProfileEmpty =
    !profile.firstName &&
    !profile.lastName &&
    !profile.gender &&
    !profile.dob;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow rounded-lg">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          My Profile
        </h2>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Edit
          </button>
        )}
      </div>

      {/* EMPTY PROFILE MESSAGE */}
      {isProfileEmpty && !editing && (
        <div className="text-gray-500">
          Complete your profile information.
        </div>
      )}

      {/* VIEW MODE */}
      {!editing && !isProfileEmpty && (
        <div className="grid grid-cols-2 gap-6 text-sm">

          <div>
            <p className="text-gray-500">First Name</p>
            <p className="font-medium">{profile.firstName}</p>
          </div>

          <div>
            <p className="text-gray-500">Last Name</p>
            <p className="font-medium">{profile.lastName}</p>
          </div>

          <div>
            <p className="text-gray-500">Gender</p>
            <p className="font-medium capitalize">{profile.gender}</p>
          </div>

          <div>
            <p className="text-gray-500">Date of Birth</p>
            <p className="font-medium">{profile.dob}</p>
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
            <label className="block text-sm mb-1">Gender</label>
            <select
              className="border w-full p-2 rounded"
              value={profile.gender || ""}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Date of Birth</label>
            <input
              type="date"
              className="border w-full p-2 rounded"
              value={profile.dob || ""}
              onChange={(e) =>
                setProfile({ ...profile, dob: e.target.value })
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