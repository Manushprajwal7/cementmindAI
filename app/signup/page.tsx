"use client";

import { FirebaseAuth } from "@/components/auth/firebase-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserRedirect } from "@/hooks/use-user-redirect";
import { useFirebaseAuth } from "@/hooks/use-firebase";

export default function SignUpPage() {
  const { user, userProfile, loading } = useFirebaseAuth();

  // Handle user redirection
  useUserRedirect();

  // If user is authenticated, don't show the sign-up form
  if (!loading && user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Sign up for a new CementMind AI account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FirebaseAuth />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
