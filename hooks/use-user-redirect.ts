// hooks/use-user-redirect.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebaseAuth } from "@/hooks/use-firebase";

export function useUserRedirect() {
  const { user, userProfile, loading } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // If not authenticated, redirect to sign in
      router.push("/signin");
      return;
    }

    // Check if we're already on the profile page
    const isProfilePage = window.location.pathname === "/profile";

    if (!isProfilePage) {
      // If user has no profile or incomplete profile, redirect to profile page
      if (!userProfile) {
        router.push("/profile");
      } else {
        // If user has a complete profile, redirect to dashboard
        // You can add more sophisticated checks here based on required fields
        router.push("/");
      }
    }
  }, [user, userProfile, loading, router]);
}
