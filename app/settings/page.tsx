"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { SettingsSidebar } from "@/components/settings/settings-sidebar"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/lib/stores/auth-store"

export default function SettingsPage() {
  const { toast } = useToast()
  const { user } = useAuthStore()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-64 shrink-0">
              <SettingsSidebar />
            </div>
            <div className="flex-1">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
              </div>

              <Tabs defaultValue="general" className="space-y-8">
                <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-1">
                  <TabsTrigger value="general">General</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <Card>
                    <CardHeader>
                      <CardTitle>General Information</CardTitle>
                      <CardDescription>Update your account information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={user?.name} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={user?.email} />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input id="company" defaultValue="TalentScope Inc." />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" defaultValue="Recruiter" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input id="password" type="password" value="••••••••" />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          onClick={() =>
                            toast({
                              title: "Profile updated",
                              description: "Your profile has been updated successfully.",
                            })
                          }
                        >
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
