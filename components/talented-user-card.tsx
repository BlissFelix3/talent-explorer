"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/user-avatar";
import {
  MapPin,
  Star,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Globe,
} from "lucide-react";
import type { TalentedUser } from "@/lib/stores/shortlist-store";
import { useShortlistStore } from "@/lib/stores/shortlist-store";
import Link from "next/link";

interface TalentedUserCardProps {
  user: TalentedUser;
  showActions?: boolean;
}

export function TalentedUserCard({
  user,
  showActions = true,
}: TalentedUserCardProps) {
  const { talentedUsers, addTalentedUser, removeTalentedUser } =
    useShortlistStore();
  const isShortlisted =
    talentedUsers?.some((u) => u.ggId === user.ggId) || false;

  const handleShortlistToggle = () => {
    if (isShortlisted) {
      removeTalentedUser(user.ggId);
    } else {
      addTalentedUser(user);
    }
  };

  const profileUrl = `/profile/${user.publicId || user.username || user.ggId}`;

  const getCompletionColor = (completion: number) => {
    if (completion >= 0.8) return "text-green-600";
    if (completion >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getTopTalentBadge = (pageRank: number) => {
    // Only show special badge for truly exceptional talent (top 1-2%)
    if (pageRank >= 0.8) {
      return {
        variant: "default" as const,
        label: "🏆 Elite Talent",
        className:
          "h-4 max-w-fit px-1.5 py-0 text-[10px] leading-tight bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold animate-pulse shadow-md border-yellow-300 inline-flex items-center gap-0.5 shrink-0",
      };
    }
    if (pageRank >= 0.6) {
      return {
        variant: "default" as const,
        label: "⭐ Top Talent",
        className:
          "h-4 max-w-fit px-1.5 py-0 text-[10px] leading-tight bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-md border-blue-400 inline-flex items-center gap-0.5 shrink-0",
      };
    }
    // No badge for others - only show for truly top talent
    return null;
  };

  const topTalentBadge = getTopTalentBadge(user.pageRank);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <UserAvatar
                src={user.picture || user.pictureThumbnail}
                name={user.name}
                size="md"
              />
              {user.verified && (
                <CheckCircle className="absolute -top-1 -right-1 h-5 w-5 text-blue-600 bg-white rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Link
                  href={profileUrl}
                  className="font-semibold hover:text-primary transition-colors"
                >
                  {user.name}
                </Link>
                {topTalentBadge && (
                  <Badge
                    variant={topTalentBadge.variant}
                    className={topTalentBadge.className}
                  >
                    {topTalentBadge.label}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {user.professionalHeadline || "Talented Professional"}
              </p>
            </div>
          </div>
          {showActions && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShortlistToggle}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {isShortlisted ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            {user.location && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{user.location.name}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>
                {user.isSearchable ? "Open to opportunities" : "Not available"}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">
                PageRank: {user.pageRank.toFixed(3)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp
                className={`h-4 w-4 ${getCompletionColor(user.completion)}`}
              />
              <span className="text-sm">
                Profile: {Math.round(user.completion * 100)}% complete
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Strength Score: {user.totalStrength}</span>
            {user.weight > 0 && <span>• Weight: {user.weight}</span>}
          </div>
        </div>

        {showActions && (
          <div className="flex space-x-2 pt-2">
            <Button asChild className="flex-1">
              <Link href={profileUrl}>View Profile</Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link
                href={`/messages/${
                  user.username || user.publicId || user.ggId
                }`}
              >
                Message
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
