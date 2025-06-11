"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthGuard } from "@/components/auth-guard";
import { Navbar } from "@/components/navbar";
import { getProfile } from "@/lib/api/torre";
import { MeetingScheduler } from "@/components/meeting-scheduler";
import { ArrowLeft, MapPin, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function ScheduleMeetingPage() {
  const params = useParams();
  const userId = params.userId as string;

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfile(userId),
  });

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container py-8">
            <div className="max-w-2xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-24 bg-muted rounded-lg" />
                <div className="h-64 bg-muted rounded-lg" />
              </div>
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  if (error || !profile) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container py-8">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Profile not found
                  </h3>
                  <p className="text-muted-foreground">
                    The profile you're trying to schedule a meeting with doesn't
                    exist.
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/search">Back to Search</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  const talentedUser = {
    ggId: profile.person.ggId,
    ardaId: profile.person.ardaId,
    name: profile.person.name,
    professionalHeadline: profile.person.professionalHeadline,
    picture: profile.person.picture,
    pictureThumbnail: profile.person.pictureThumbnail,
    verified: profile.person.verified,
    weight: 0,
    pageRank: 0,
    username: profile.person.publicId || "",
    publicId: profile.person.publicId,
    completion: profile.person.completion,
    totalStrength: 0,
    isSearchable: true,
    location: profile.person.location,
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Navigation */}
            <Button variant="ghost" asChild className="mb-4">
              <Link
                href={`/profile/${userId}`}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
              </Link>
            </Button>

            {/* User Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={
                          profile.person.picture ||
                          profile.person.pictureThumbnail ||
                          "/placeholder.svg"
                        }
                        alt={profile.person.name}
                      />
                      <AvatarFallback>
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                          {profile.person.name.charAt(0)}
                        </div>
                      </AvatarFallback>
                    </Avatar>
                    {profile.person.verified && (
                      <CheckCircle className="absolute -top-1 -right-1 h-5 w-5 text-blue-600 bg-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">
                      {profile.person.name}
                    </h2>
                    <p className="text-muted-foreground">
                      {profile.person.professionalHeadline ||
                        "Talented Professional"}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      {profile.person.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{profile.person.location.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>
                          {Math.round(profile.person.completion * 100)}%
                          Complete
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {profile.strengths.slice(0, 3).map((strength, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {strength.name}
                        </Badge>
                      ))}
                      {profile.strengths.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{profile.strengths.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meeting Scheduler */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule a Meeting</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose a convenient time to connect with {profile.person.name}{" "}
                  and discuss potential opportunities.
                </p>
              </CardHeader>
              <CardContent>
                <MeetingScheduler user={talentedUser} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
