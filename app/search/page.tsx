"use client"

import { useState, useRef, useCallback } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CandidateCard } from "@/components/candidate-card"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { candidatesApi } from "@/lib/api/candidates"
import { recommendationsApi } from "@/lib/api/recommendations"
import { useDebounce } from "@/hooks/use-debounce"
import { useQuery } from "@tanstack/react-query"
import { Search, Loader2, Lightbulb, Filter, MapPin, DollarSign, Clock, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedQuery = useDebounce(searchQuery, 300)
  const observerRef = useRef<IntersectionObserver>()

  // Filter states
  const [filters, setFilters] = useState({
    location: "",
    experience: "",
    salaryRange: [0, 200000],
    skills: [] as string[],
  })
  const [activeFilters, setActiveFilters] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  // Fetch recommended candidates
  const { data: recommendedCandidates, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ["recommendedCandidates"],
    queryFn: () => recommendationsApi.getCandidateRecommendations(),
  })

  // Fetch candidates with search and filters
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteQuery({
    queryKey: ["candidates", debouncedQuery, filters],
    queryFn: ({ pageParam = 1 }) => candidatesApi.search(debouncedQuery, pageParam, filters),
    getNextPageParam: (lastPage, pages) => (lastPage.hasMore ? pages.length + 1 : undefined),
    initialPageParam: 1,
  })

  const lastCandidateRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return
      if (observerRef.current) observerRef.current.disconnect()
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      })
      if (node) observerRef.current.observe(node)
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage],
  )

  const candidates = data?.pages.flatMap((page) => page.candidates) ?? []

  // Update filters
  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value }

      // Count active filters
      let count = 0
      if (newFilters.location) count++
      if (newFilters.experience) count++
      if (newFilters.salaryRange[0] > 0 || newFilters.salaryRange[1] < 200000) count++
      if (newFilters.skills.length > 0) count++

      setActiveFilters(count)
      return newFilters
    })
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      location: "",
      experience: "",
      salaryRange: [0, 200000],
      skills: [],
    })
    setActiveFilters(0)
  }

  // Toggle skill selection
  const toggleSkill = (skill: string) => {
    setFilters((prev) => {
      const skills = prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill]

      return { ...prev, skills }
    })
  }

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
                  exceptional
                </span>{" "}
                talent
              </h1>
              <p className="text-xl text-muted-foreground">
                Search through thousands of qualified candidates to find your perfect match
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search by name, skills, or role..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-lg"
                    />
                  </div>
                  <Popover open={showFilters} onOpenChange={setShowFilters}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
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
                          <Button variant="ghost" size="sm" onClick={resetFilters}>
                            Reset
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Select value={filters.location} onValueChange={(value) => updateFilter("location", value)}>
                            <SelectTrigger id="location" className="w-full">
                              <SelectValue placeholder="Any location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any location</SelectItem>
                              <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
                              <SelectItem value="New York, NY">New York, NY</SelectItem>
                              <SelectItem value="Seattle, WA">Seattle, WA</SelectItem>
                              <SelectItem value="Austin, TX">Austin, TX</SelectItem>
                              <SelectItem value="Remote">Remote</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experience">Experience Level</Label>
                          <Select
                            value={filters.experience}
                            onValueChange={(value) => updateFilter("experience", value)}
                          >
                            <SelectTrigger id="experience" className="w-full">
                              <SelectValue placeholder="Any experience" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any experience</SelectItem>
                              <SelectItem value="0-2 years">0-2 years</SelectItem>
                              <SelectItem value="3-5 years">3-5 years</SelectItem>
                              <SelectItem value="6-8 years">6-8 years</SelectItem>
                              <SelectItem value="8+ years">8+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Salary Range</Label>
                            <span className="text-sm text-muted-foreground">
                              ${filters.salaryRange[0].toLocaleString()} - ${filters.salaryRange[1].toLocaleString()}
                            </span>
                          </div>
                          <Slider
                            defaultValue={[0, 200000]}
                            min={0}
                            max={200000}
                            step={10000}
                            value={filters.salaryRange}
                            onValueChange={(value) => updateFilter("salaryRange", value)}
                            className="py-4"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Skills</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {["React", "TypeScript", "Python", "Node.js", "AWS", "Docker"].map((skill) => (
                              <div key={skill} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`skill-${skill}`}
                                  checked={filters.skills.includes(skill)}
                                  onCheckedChange={() => toggleSkill(skill)}
                                />
                                <Label htmlFor={`skill-${skill}`} className="text-sm">
                                  {skill}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full" onClick={() => setShowFilters(false)}>
                          Apply Filters
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {activeFilters > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {filters.location && (
                      <Badge variant="secondary" className="flex items-center gap-1">
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

                    {filters.experience && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {filters.experience}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1 hover:bg-transparent"
                          onClick={() => updateFilter("experience", "")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}

                    {(filters.salaryRange[0] > 0 || filters.salaryRange[1] < 200000) && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />${filters.salaryRange[0].toLocaleString()} - $
                        {filters.salaryRange[1].toLocaleString()}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1 hover:bg-transparent"
                          onClick={() => updateFilter("salaryRange", [0, 200000])}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}

                    {filters.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
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

            {/* Recommendations Section */}
            {!searchQuery && !activeFilters && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Recommended for you
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingRecommendations ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {recommendedCandidates?.map((candidate) => (
                        <CandidateCard key={candidate.id} candidate={candidate} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {error && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-destructive">Failed to load candidates. Please try again.</p>
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
                  {candidates.map((candidate, index) => (
                    <div key={candidate.id} ref={index === candidates.length - 1 ? lastCandidateRef : null}>
                      <CandidateCard candidate={candidate} />
                    </div>
                  ))}
                </div>

                {isFetchingNextPage && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}

                {candidates.length === 0 && !isLoading && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No candidates found</h3>
                      <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
