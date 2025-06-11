"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Search,
  Users,
  TrendingUp,
  BarChart2,
  Zap,
  Shield,
  Star,
} from "lucide-react";

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/search");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="container pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-block rounded-full bg-gradient-to-r from-purple-600/10 to-blue-600/10 px-4 py-1.5 text-sm font-medium text-purple-700 dark:text-purple-300">
              ✨ Introducing TalentScope 2.0
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Connect with{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                top talent
              </span>{" "}
              worldwide
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl">
              TalentScope helps you discover and connect with the world's most
              talented professionals. Search, explore, and schedule meetings
              with top-ranked talent from around the globe.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Link href="/signup">Get started free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>

          <div className="mt-12 rounded-xl border bg-muted/50 p-2 max-w-5xl w-full shadow-xl">
            <div className="w-full">
              <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-lg">
                <iframe
                  src="https://www.youtube.com/embed/5MKSSMlG-N8?autoplay=1&mute=1&loop=1&playlist=5MKSSMlG-N8"
                  title="TalentScope Demo"
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-primary">
                10k+
              </p>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-primary">1M+</p>
              <p className="text-muted-foreground">Talented Professionals</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-primary">95%</p>
              <p className="text-muted-foreground">Connection Success</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-primary">60%</p>
              <p className="text-muted-foreground">Faster Discovery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to connect with top talent
            </h2>
            <p className="text-muted-foreground text-lg">
              Our comprehensive platform helps you discover, explore, and
              connect with the world's most talented professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI-Powered Discovery</h3>
                <p className="text-muted-foreground">
                  Discover top talent with our intelligent search algorithm that
                  finds the most relevant professionals based on your criteria.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Comprehensive Profiles
                </h3>
                <p className="text-muted-foreground">
                  Explore detailed profiles showcasing skills, experience, and
                  achievements of talented professionals worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Market Trends</h3>
                <p className="text-muted-foreground">
                  Stay ahead of the competition with real-time insights into
                  talent market trends and compensation data.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Make data-driven decisions with powerful analytics and
                  visualizations of your recruitment pipeline.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">PageRank Scoring</h3>
                <p className="text-muted-foreground">
                  Discover professionals ranked by their expertise and
                  achievements, helping you identify top talent quickly.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Collaboration</h3>
                <p className="text-muted-foreground">
                  Collaborate securely with your team on candidate evaluations,
                  notes, and hiring decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Streamlined recruitment in 4 simple steps
            </h2>
            <p className="text-muted-foreground text-lg">
              Our platform makes finding and hiring top talent easier than ever
              before.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Set up your company profile and define your hiring needs and
                preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Discover Candidates</h3>
              <p className="text-muted-foreground">
                Use our AI-powered search to find candidates that match your
                requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Evaluate & Compare</h3>
              <p className="text-muted-foreground">
                Review detailed profiles and compare candidates side by side.
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="text-xl font-bold mb-2">
                Make Informed Decisions
              </h3>
              <p className="text-muted-foreground">
                Use data-driven insights to select the best candidates for your
                team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by recruiters worldwide
            </h2>
            <p className="text-muted-foreground text-lg">
              See what our customers have to say about their experience with
              TalentScope.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-muted-foreground mb-4">
                  "TalentScope has revolutionized our hiring process. We've
                  reduced our time-to-hire by 40% and found candidates that are
                  a perfect fit for our culture."
                </p>
                <div className="flex items-center">
                  <div className="rounded-full bg-muted w-10 h-10 flex items-center justify-center mr-3">
                    <span className="font-semibold">JD</span>
                  </div>
                  <div>
                    <p className="font-semibold">Jane Doe</p>
                    <p className="text-sm text-muted-foreground">
                      HR Director, Tech Co.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-muted-foreground mb-4">
                  "The talent genome feature is incredible. It gives us insights
                  into candidates that we couldn't get anywhere else. It's like
                  having an AI recruiter on your team."
                </p>
                <div className="flex items-center">
                  <div className="rounded-full bg-muted w-10 h-10 flex items-center justify-center mr-3">
                    <span className="font-semibold">MS</span>
                  </div>
                  <div>
                    <p className="font-semibold">Michael Smith</p>
                    <p className="text-sm text-muted-foreground">
                      Talent Acquisition, StartupX
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-muted-foreground mb-4">
                  "As a small business, we don't have a dedicated HR team.
                  TalentScope has made it possible for us to compete for top
                  talent with much larger companies."
                </p>
                <div className="flex items-center">
                  <div className="rounded-full bg-muted w-10 h-10 flex items-center justify-center mr-3">
                    <span className="font-semibold">AL</span>
                  </div>
                  <div>
                    <p className="font-semibold">Amanda Lee</p>
                    <p className="text-sm text-muted-foreground">
                      Founder, GrowthLab
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to transform your hiring process?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Join thousands of companies that are already using TalentScope to
              find and hire exceptional talent.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/10"
                asChild
              >
                <Link href="/demo">Request Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 border-t">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
                  <span className="text-sm font-bold text-white">TS</span>
                </div>
                <span className="font-bold">TalentScope</span>
              </Link>
              <p className="text-muted-foreground mb-4">
                AI-powered recruitment platform that helps you find and hire
                exceptional talent faster than ever before.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 2H2v10h10V2zM22 2h-8v8h8V2zM12 14H2v8h10v-8zM22 14h-8v8h8v-8z"></path>
                  </svg>
                  <span className="sr-only">Slack</span>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#features"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/integrations"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/changelog"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/webinars"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Webinars
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-muted-foreground/20 text-center text-muted-foreground">
            <p>
              © {new Date().getFullYear()} TalentScope. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
