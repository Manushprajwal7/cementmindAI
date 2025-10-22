"use client";

import { UserProfile } from "@/components/auth/user-profile";
import { FirebaseAuth } from "@/components/auth/firebase-auth";
import { useFirebaseAuth } from "@/hooks/use-firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, userProfile, loading } = useFirebaseAuth();
  const router = useRouter();

  // Redirect to dashboard if user already has a complete profile
  useEffect(() => {
    if (!loading && user && userProfile) {
      // Check if the user has a complete profile
      // You can customize this logic based on what constitutes a "complete" profile
      const hasCompleteProfile =
        userProfile.firstName && userProfile.lastName && userProfile.company;

      if (hasCompleteProfile) {
        // Redirect to dashboard if profile is already complete
        router.push("/");
      }
    }
  }, [user, userProfile, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!user) {
    router.push("/signin");
    return null;
  }

  // If user already has a complete profile, don't show the profile page
  if (userProfile) {
    const hasCompleteProfile =
      userProfile.firstName && userProfile.lastName && userProfile.company;
    if (hasCompleteProfile) {
      return null;
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">User Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <UserProfile />
          </div>
          <div>
            <FirebaseAuth />
          </div>
        </div>
      </div>
    </div>
  );
}
