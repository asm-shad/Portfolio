/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  picture: string;
  role: string;
  status: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  skills: string[];
  _count?: {
    posts: number;
    projects: number;
  };
}

export default function EditProfileForm() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [currentTech, setCurrentTech] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    picture: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
    skills: [] as string[],
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/user/${session.user.id}`,
          {
            credentials: "include",
          }
        );

        if (res.ok) {
          const userData = await res.json();
          setProfile(userData);
          setForm({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            picture: userData.picture || "",
            location: userData.location || "",
            website: userData.website || "",
            github: userData.github || "",
            linkedin: userData.linkedin || "",
            twitter: userData.twitter || "",
            skills: userData.skills || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (currentTech.trim() && !form.skills.includes(currentTech.trim())) {
      setForm((prev) => ({
        ...prev,
        skills: [...prev.skills, currentTech.trim()],
      }));
      setCurrentTech("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return toast.error("You must be logged in!");

    setLoading(true);
    try {
      const payload = {
        ...form,
      };

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_API}/user/${session.user.id}`,
        payload,
        {
          withCredentials: true,
        }
      );

      // Update the session with new user data
      await update({
        ...session,
        user: {
          ...session.user,
          name: form.name,
          email: form.email,
          image: form.picture,
        },
      });

      toast.success("Profile updated successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center">Loading profile...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border border-slate-200">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-foreground">Edit Profile</h2>
        <p className="text-sm text-muted-foreground">
          Update your personal information and social links
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-base font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-base font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="mt-2"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-base font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-base font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="picture" className="text-base font-medium">
                Profile Picture URL
              </Label>
              <Input
                id="picture"
                name="picture"
                value={form.picture}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Link to your profile picture
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Skills & Expertise</h3>

            <div className="flex gap-2 mb-3">
              <Input
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a skill (e.g., React, Node.js, UI/UX)"
                className="flex-1"
              />
              <Button type="button" onClick={addSkill} variant="outline">
                Add
              </Button>
            </div>

            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-destructive text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Social Links</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website" className="text-base font-medium">
                  Personal Website
                </Label>
                <Input
                  id="website"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="github" className="text-base font-medium">
                  GitHub
                </Label>
                <Input
                  id="github"
                  name="github"
                  value={form.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin" className="text-base font-medium">
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="twitter" className="text-base font-medium">
                  Twitter / X
                </Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={form.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/username"
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Stats (Read-only) */}
          {profile._count && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-medium">Profile Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Blog Posts:</span>
                  <span className="ml-2 text-muted-foreground">
                    {profile._count.posts}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Projects:</span>
                  <span className="ml-2 text-muted-foreground">
                    {profile._count.projects}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Role:</span>
                  <span className="ml-2 text-muted-foreground capitalize">
                    {profile.role.toLowerCase().replace("_", " ")}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className="ml-2 text-muted-foreground capitalize">
                    {profile.status.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full py-3 text-lg"
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating Profile...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
