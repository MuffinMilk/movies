import React, { useState } from 'react';
import { Plus, Check, X, User, Edit3, Trash2 } from 'lucide-react';

export interface Profile {
  id: string;
  name: string;
  avatarBg: string;
  avatarText: string;
  isDefault?: boolean;
}

const DEFAULT_PROFILES: Profile[] = [
  {
    id: 'default',
    name: 'Default',
    avatarBg: 'bg-gradient-to-tr from-slate-200 via-slate-100 to-slate-300 text-slate-800',
    avatarText: 'D',
    isDefault: true,
  },
];

interface ProfileSelectorProps {
  userEmail?: string;
  onSelectProfile: (profile: Profile) => void;
  onCancel?: () => void;
}

export default function ProfileSelector({
  onSelectProfile,
  onCancel,
}: ProfileSelectorProps) {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('dulo_profiles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_PROFILES;
      }
    }
    return DEFAULT_PROFILES;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [isManaging, setIsManaging] = useState(false);

  const saveProfiles = (updated: Profile[]) => {
    setProfiles(updated);
    localStorage.setItem('dulo_profiles', JSON.stringify(updated));
  };

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    const colors = [
      'bg-gradient-to-tr from-sky-200 to-indigo-200 text-slate-800',
      'bg-gradient-to-tr from-purple-300 to-pink-300 text-slate-900',
      'bg-gradient-to-tr from-emerald-200 to-teal-300 text-slate-900',
      'bg-gradient-to-tr from-amber-200 to-orange-300 text-slate-900',
      'bg-gradient-to-tr from-rose-300 to-red-400 text-white',
    ];

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const initial = newProfileName.trim().charAt(0).toUpperCase();

    const newProfile: Profile = {
      id: Date.now().toString(),
      name: newProfileName.trim(),
      avatarBg: randomColor,
      avatarText: initial,
    };

    const updated = [...profiles, newProfile];
    saveProfiles(updated);
    setNewProfileName('');
    setIsAdding(false);
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    const updated = profiles.filter((p) => p.id !== id);
    saveProfiles(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#252528] via-[#141416] to-[#0d0d0f] text-white flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in select-none">
      <div className="w-full max-w-xl flex flex-col items-center text-center space-y-8">
        {/* Main Title & Subtitle */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
            Who's watching?
          </h1>
          <p className="text-gray-400 text-sm sm:text-base font-medium tracking-wide">
            Choose a profile to continue.
          </p>
        </div>

        {/* Profiles Horizontal List */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 my-6">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => {
                if (!isManaging) {
                  localStorage.setItem('dulo_active_profile', JSON.stringify(profile));
                  onSelectProfile(profile);
                }
              }}
              className="group flex flex-col items-center cursor-pointer relative"
            >
              {/* Avatar Circle */}
              <div
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full ${
                  profile.avatarBg || 'bg-gradient-to-tr from-slate-200 to-slate-300 text-slate-800'
                } flex items-center justify-center shadow-2xl transition-all duration-300 transform group-hover:scale-105 group-hover:ring-4 group-hover:ring-white/30 relative overflow-hidden`}
              >
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                  {profile.avatarText}
                </span>

                {/* Manage Delete Overlay */}
                {isManaging && !profile.isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProfile(profile.id);
                    }}
                    className="absolute inset-0 bg-black/75 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-8 h-8" />
                  </button>
                )}
              </div>

              {/* Profile Label */}
              <span className="mt-3 text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                {profile.name}
              </span>
            </div>
          ))}

          {/* Add Profile Icon */}
          <div
            onClick={() => setIsAdding(true)}
            className="group flex flex-col items-center cursor-pointer"
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#1e1f24] hover:bg-[#282a32] border border-white/10 hover:border-white/30 text-gray-400 hover:text-white flex items-center justify-center shadow-2xl transition-all duration-300 transform group-hover:scale-105">
              <Plus className="w-12 h-12 stroke-[1.5]" />
            </div>
            <span className="mt-3 text-sm font-semibold text-gray-400 group-hover:text-white transition-colors">
              Add Profile
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setIsManaging(!isManaging)}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer shadow-md ${
              isManaging
                ? 'bg-red-600/20 text-red-400 border-red-500/40 hover:bg-red-600/30'
                : 'bg-[#1c1d22] hover:bg-[#26272e] text-gray-200 hover:text-white border-white/10'
            }`}
          >
            {isManaging ? 'Done Managing' : 'Manage profiles'}
          </button>

          <button
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                onSelectProfile(profiles[0]);
              }
            }}
            className="bg-[#1c1d22] hover:bg-[#26272e] text-gray-200 hover:text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-2xl border border-white/10 transition-all cursor-pointer shadow-md"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Add Profile Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1a1a1e] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative">
            <button
              onClick={() => setIsAdding(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white bg-white/5 p-2 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">Add Profile</h2>
              <p className="text-xs text-gray-400">Add a new viewer profile to your account</p>
            </div>

            <form onSubmit={handleAddProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                  Profile Name
                </label>
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="e.g. Alex, Kids, Movies Room"
                  autoFocus
                  className="w-full bg-[#121214] border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="w-1/2 bg-white/10 hover:bg-white/15 text-gray-300 font-semibold text-sm py-2.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newProfileName.trim()}
                  className="w-1/2 bg-white text-black hover:bg-gray-200 disabled:opacity-50 font-bold text-sm py-2.5 rounded-xl transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
