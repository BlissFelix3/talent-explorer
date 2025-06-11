"use client";

import { useState, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TalentedUserCard } from "@/components/talented-user-card";
import { AuthGuard } from "@/components/auth-guard";
import { Navbar } from "@/components/navbar";
import { searchPeople, getTopRankedPeople } from "@/lib/api/torre";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Loader2,
  Star,
  Filter,
  MapPin,
  TrendingUp,
  Clock,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const observerRef = useRef<IntersectionObserver>();

  // Filter states
  const [filters, setFilters] = useState({
    location: "",
    skills: [] as string[],
  });
  const [activeFilters, setActiveFilters] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch top ranked talented users when no search query
  const { data: topRankedUsers, isLoading: isLoadingTopRanked } = useQuery({
    queryKey: ["topRankedUsers"],
    queryFn: () => getTopRankedPeople(50),
    enabled: !debouncedQuery, // Only fetch when no search query
  });

  // Fetch talented users with search and filters
  const {
    data: searchResults,
    isLoading: isSearching,
    error,
  } = useQuery({
    queryKey: ["searchTalentedUsers", debouncedQuery, filters],
    queryFn: () => searchPeople({ query: debouncedQuery, limit: 50, filters }),
    enabled: !!debouncedQuery, // Only search when there's a query
  });

  // Determine which data to display
  const displayData = debouncedQuery ? searchResults : topRankedUsers;
  const isLoading = debouncedQuery ? isSearching : isLoadingTopRanked;
  const talentedUsers = displayData?.results ?? [];

  // Update filters
  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };

      // Count active filters
      let count = 0;
      if (newFilters.location) count++;
      if (newFilters.skills.length > 0) count++;

      setActiveFilters(count);
      return newFilters;
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      location: "",
      skills: [],
    });
    setActiveFilters(0);
  };

  // Toggle skill selection
  const toggleSkill = (skill: string) => {
    setFilters((prev) => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];

      return { ...prev, skills };
    });
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">
                Discover{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  top talent
                </span>{" "}
                worldwide
              </h1>
              <p className="text-xl text-muted-foreground">
                {debouncedQuery
                  ? `Search results for "${debouncedQuery}"`
                  : "Explore the highest-ranked talented professionals from around the world"}
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search talented professionals by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-lg"
                    />
                  </div>
                  <Popover open={showFilters} onOpenChange={setShowFilters}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Filter className="h-4 w-4" />
                        Filters
                        {activeFilters > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {activeFilters}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 md:w-96">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Filters</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                          >
                            Reset
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Select
                            value={filters.location}
                            onValueChange={(value) =>
                              updateFilter("location", value)
                            }
                          >
                            <SelectTrigger id="location" className="w-full">
                              <SelectValue placeholder="Any location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Any location</SelectItem>
                              <SelectItem value="United States">
                                United States
                              </SelectItem>
                              <SelectItem value="Canada">Canada</SelectItem>
                              <SelectItem value="United Kingdom">
                                United Kingdom
                              </SelectItem>
                              <SelectItem value="Germany">Germany</SelectItem>
                              <SelectItem value="France">France</SelectItem>
                              <SelectItem value="Spain">Spain</SelectItem>
                              <SelectItem value="Brazil">Brazil</SelectItem>
                              <SelectItem value="Argentina">
                                Argentina
                              </SelectItem>
                              <SelectItem value="Mexico">Mexico</SelectItem>
                              <SelectItem value="India">India</SelectItem>
                              <SelectItem value="Australia">
                                Australia
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Skills</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              "JavaScript",
                              "Python",
                              "React",
                              "Node.js",
                              "TypeScript",
                              "AWS",
                              "Docker",
                              "Machine Learning",
                            ].map((skill) => (
                              <div
                                key={skill}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`skill-${skill}`}
                                  checked={filters.skills.includes(skill)}
                                  onCheckedChange={() => toggleSkill(skill)}
                                />
                                <Label
                                  htmlFor={`skill-${skill}`}
                                  className="text-sm"
                                >
                                  {skill}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          onClick={() => setShowFilters(false)}
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {activeFilters > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {filters.location && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <MapPin className="h-3 w-3" />
                        {filters.location}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1 hover:bg-transparent"
                          onClick={() => updateFilter("location", "")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}

                    {filters.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {skill}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1 hover:bg-transparent"
                          onClick={() => toggleSkill(skill)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Ranked Section */}
            {!searchQuery && !activeFilters && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Top Ranked Talent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Discover the highest-ranked talented professionals based on
                    their Torre PageRank scores.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Results Summary */}
            {talentedUsers.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {debouncedQuery
                    ? `Found ${
                        displayData?.total || talentedUsers.length
                      } talented professionals matching "${debouncedQuery}"`
                    : `Showing ${talentedUsers.length} top-ranked talented professionals`}
                </p>
                {debouncedQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                  >
                    View Top Ranked
                  </Button>
                )}
              </div>
            )}

            {error && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-destructive">
                    Failed to load talented professionals. Please try again.
                  </p>
                </CardContent>
              </Card>
            )}

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {talentedUsers.map((user) => (
                    <TalentedUserCard key={user.ggId} user={user} />
                  ))}
                </div>

                {talentedUsers.length === 0 && !isLoading && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No talented professionals found
                      </h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search terms or filters
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
