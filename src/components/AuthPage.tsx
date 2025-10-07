import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Activity } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>, role: "instructor" | "student") => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Mock authentication - in production, this would call a real auth API
    setTimeout(() => {
      const mockUser = {
        id: Math.random().toString(36).substring(7),
        email,
        role,
        name: email.split("@")[0],
      };

      sessionStorage.setItem("fitcoach_user", JSON.stringify(mockUser));
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${role}`,
      });

      setIsLoading(false);
      navigate(role === "instructor" ? "/instructor" : "/student");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Activity className="h-10 w-10 text-primary" aria-hidden="true" />
            <h1 className="text-4xl font-bold text-foreground">FitCoach</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Real-time fitness engagement tracking
          </p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Choose your role and enter your credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="instructor" className="w-full">
              <TabsList className="grid w-full grid-cols-2" role="tablist">
                <TabsTrigger value="instructor" role="tab" aria-controls="instructor-panel">
                  Instructor
                </TabsTrigger>
                <TabsTrigger value="student" role="tab" aria-controls="student-panel">
                  Student
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="instructor" id="instructor-panel" role="tabpanel">
                <form onSubmit={(e) => handleLogin(e, "instructor")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instructor-email">Email</Label>
                    <Input
                      id="instructor-email"
                      name="email"
                      type="email"
                      placeholder="instructor@fitcoach.com"
                      required
                      aria-required="true"
                      defaultValue="instructor@fitcoach.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructor-password">Password</Label>
                    <Input
                      id="instructor-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      aria-required="true"
                      defaultValue="password"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="hero"
                    size="lg"
                    disabled={isLoading}
                    aria-label="Sign in as instructor"
                  >
                    {isLoading ? "Signing in..." : "Sign In as Instructor"}
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Demo: instructor@fitcoach.com / password
                </p>
              </TabsContent>
              
              <TabsContent value="student" id="student-panel" role="tabpanel">
                <form onSubmit={(e) => handleLogin(e, "student")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <Input
                      id="student-email"
                      name="email"
                      type="email"
                      placeholder="student@fitcoach.com"
                      required
                      aria-required="true"
                      defaultValue="student@fitcoach.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <Input
                      id="student-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      aria-required="true"
                      defaultValue="password"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    variant="hero"
                    size="lg"
                    disabled={isLoading}
                    aria-label="Sign in as student"
                  >
                    {isLoading ? "Signing in..." : "Sign In as Student"}
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Demo: student@fitcoach.com / password
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}