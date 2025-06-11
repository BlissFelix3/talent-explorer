"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/user-avatar";
import { Progress } from "@/components/ui/progress";
import { AuthGuard } from "@/components/auth-guard";
import { Navbar } from "@/components/navbar";
import { getProfile } from "@/lib/api/torre";
import { useShortlistStore } from "@/lib/stores/shortlist-store";
import {
  MapPin,
  Star,
  Clock,
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  CheckCircle,
  Globe,
  Calendar,
  ExternalLink,
  Award,
  Users,
  BookOpen,
  TrendingUp,
  Code,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { toast } = useToast();
  const { talentedUsers, addTalentedUser, removeTalentedUser } =
    useShortlistStore();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => getProfile(username),
  });

  const isShortlisted =
    profile && talentedUsers.some((u) => u.ggId === profile.person.ggId);

  const handleShortlistToggle = () => {
    if (!profile) return;

    const talentedUser = {
      ggId: profile.person.ggId,
      ardaId: profile.person.ardaId,
      name: profile.person.name,
      professionalHeadline: profile.person.professionalHeadline,
      picture: profile.person.picture,
      pictureThumbnail: profile.person.pictureThumbnail,
      verified: profile.person.verified,
      weight: 0, // Not available in profile response
      pageRank: 0, // Not available in profile response
      username: profile.person.publicId || "",
      publicId: profile.person.publicId,
      completion: profile.person.completion,
      totalStrength: 0, // Not available in profile response
      isSearchable: true,
      location: profile.person.location,
    };

    if (isShortlisted) {
      removeTalentedUser(profile.person.ggId);
      toast({
        title: "Removed from shortlist",
        description: `${profile.person.name} has been removed from your shortlist.`,
      });
    } else {
      addTalentedUser(talentedUser);
      toast({
        title: "Added to shortlist",
        description: `${profile.person.name} has been added to your shortlist.`,
      });
    }
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case "expert":
        return "text-green-600 bg-green-50";
      case "proficient":
        return "text-blue-600 bg-blue-50";
      case "novice":
        return "text-orange-600 bg-orange-50";
      case "no-experience-interested":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Present";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container py-8">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-48 bg-muted rounded-lg" />
                <div className="h-32 bg-muted rounded-lg" />
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
            <div className="max-w-6xl mx-auto">
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Profile not found
                  </h3>
                  <p className="text-muted-foreground">
                    The profile you're looking for doesn't exist or is not
                    available.
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="relative">
                    <UserAvatar
                      src={
                        profile.person.picture ||
                        profile.person.pictureThumbnail
                      }
                      name={profile.person.name}
                      size="xl"
                    />
                    {profile.person.verified && (
                      <CheckCircle className="absolute -top-2 -right-2 h-8 w-8 text-blue-600 bg-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <h1 className="text-4xl font-bold">
                        {profile.person.name}
                      </h1>
                      <p className="text-xl text-muted-foreground mt-1">
                        {profile.person.professionalHeadline ||
                          "Talented Professional"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {profile.person.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{profile.person.location.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>
                          {Math.round(profile.person.completion * 100)}% Profile
                          Complete
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {formatDate(profile.person.created)}</span>
                      </div>
                    </div>

                    {profile.person.summaryOfBio && (
                      <p className="text-muted-foreground leading-relaxed max-w-2xl">
                        {profile.person.summaryOfBio}
                      </p>
                    )}

                    {/* Links */}
                    {profile.person.links &&
                      profile.person.links.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {profile.person.links.map((link, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              asChild
                              className="flex items-center gap-1"
                            >
                              <a
                                href={link.address}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3 w-3" />
                                {link.name}
                              </a>
                            </Button>
                          ))}
                        </div>
                      )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleShortlistToggle}
                      className="flex items-center gap-2"
                    >
                      {isShortlisted ? (
                        <>
                          <BookmarkCheck className="h-4 w-4" />
                          Remove from Shortlist
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4" />
                          Add to Shortlist
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      asChild
                      className="flex items-center gap-2"
                    >
                      <Link href={`/messages/${profile.person.ggId}`}>
                        <MessageCircle className="h-4 w-4" />
                        Message
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      asChild
                      className="flex items-center gap-2"
                    >
                      <Link href={`/schedule-meeting/${profile.person.ggId}`}>
                        <Calendar className="h-4 w-4" />
                        Schedule Meeting
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{profile.stats.jobs}</div>
                  <p className="text-sm text-muted-foreground">
                    Work Experience
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {profile.stats.education}
                  </div>
                  <p className="text-sm text-muted-foreground">Education</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Code className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {profile.stats.strengths}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Skills & Strengths
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {profile.stats.projects || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Skills & Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Skills & Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.strengths.slice(0, 10).map((strength, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{strength.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getProficiencyColor(
                                strength.proficiency
                              )}`}
                            >
                              {strength.proficiency.replace("-", " ")}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {strength.hits} hits • {strength.recommendations}{" "}
                              recommendations
                            </span>
                          </div>
                        </div>
                        {strength.pin && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Languages */}
              {profile.languages && profile.languages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile.languages.map((language, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <span className="font-medium">
                            {language.language}
                          </span>
                          <Badge variant="outline">{language.fluency}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Experience */}
            {profile.experiences && profile.experiences.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {profile.experiences.map((experience, index) => (
                      <div
                        key={index}
                        className="flex gap-4 pb-6 border-b last:border-b-0"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">
                            {experience.name}
                          </h4>
                          {experience.organizations &&
                            experience.organizations.length > 0 && (
                              <p className="text-muted-foreground font-medium">
                                {experience.organizations[0].name}
                              </p>
                            )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {experience.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {experience.fromMonth} {experience.fromYear} -{" "}
                              {experience.toMonth || ""}{" "}
                              {experience.toYear || "Present"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Profile Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Profile Completion</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(profile.person.completion * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={profile.person.completion * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-medium mb-2">Skills Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Expert</span>
                          <span>
                            {
                              profile.processed.skillsProficiencyBreakdown
                                .expert
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Proficient</span>
                          <span>
                            {
                              profile.processed.skillsProficiencyBreakdown
                                .proficient
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Novice</span>
                          <span>
                            {
                              profile.processed.skillsProficiencyBreakdown
                                .novice
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interested</span>
                          <span>
                            {
                              profile.processed.skillsProficiencyBreakdown[
                                "no-experience-interested"
                              ]
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-medium mb-2">Experience Summary</h4>
                      <p className="text-sm text-muted-foreground">
                        {profile.processed.experienceSummary}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Estimated {profile.processed.experienceYears} years of
                        experience
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
