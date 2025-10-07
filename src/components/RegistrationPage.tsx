import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Activity } from "lucide-react";
import { z } from "zod";

const registrationSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password must be less than 128 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationForm, string>>>({});

  const handleRegistration = async (
    e: React.FormEvent<HTMLFormElement>, 
    role: "instructor" | "student"
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    try {
      // Validate input
      const validatedData = registrationSchema.parse(data);

      // Mock registration - in production, this would call a real auth API
      setTimeout(() => {
        const mockUser = {
          id: Math.random().toString(36).substring(7),
          email: validatedData.email,
          role,
          name: validatedData.name,
        };

        sessionStorage.setItem("fitcoach_user", JSON.stringify(mockUser));
        
        toast({
          title: "Account created!",
          description: `Welcome to FitCoach, ${validatedData.name}!`,
        });

        setIsLoading(false);
        navigate(role === "instructor" ? "/instructor" : "/student");
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof RegistrationForm, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof RegistrationForm] = err.message;
          }
        });
        setErrors(fieldErrors);
        
        toast({
          title: "Validation error",
          description: "Please check the form for errors",
          variant: "destructive",
        });
      }
    }
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
            Create your account to get started
          </p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Choose your role and fill in your details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="instructor" className="w-full">
              <TabsList className="grid w-full grid-cols-2" role="tablist">
                <TabsTrigger value="instructor" role="tab" aria-controls="instructor-register">
                  Instructor
                </TabsTrigger>
                <TabsTrigger value="student" role="tab" aria-controls="student-register">
                  Student
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="instructor" id="instructor-register" role="tabpanel">
                <form onSubmit={(e) => handleRegistration(e, "instructor")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instructor-name">Full Name</Label>
                    <Input
                      id="instructor-name"
                      name="name"
                      type="text"
                      placeholder="Jane Doe"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "instructor-name-error" : undefined}
                    />
                    {errors.name && (
                      <p id="instructor-name-error" className="text-sm text-destructive" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instructor-reg-email">Email</Label>
                    <Input
                      id="instructor-reg-email"
                      name="email"
                      type="email"
                      placeholder="instructor@fitcoach.com"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "instructor-email-error" : undefined}
                    />
                    {errors.email && (
                      <p id="instructor-email-error" className="text-sm text-destructive" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instructor-reg-password">Password</Label>
                    <Input
                      id="instructor-reg-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "instructor-password-error" : "instructor-password-hint"}
                    />
                    {errors.password ? (
                      <p id="instructor-password-error" className="text-sm text-destructive" role="alert">
                        {errors.password}
                      </p>
                    ) : (
                      <p id="instructor-password-hint" className="text-xs text-muted-foreground">
                        Min 8 characters with uppercase, lowercase, and number
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instructor-confirm-password">Confirm Password</Label>
                    <Input
                      id="instructor-confirm-password"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={errors.confirmPassword ? "instructor-confirm-error" : undefined}
                    />
                    {errors.confirmPassword && (
                      <p id="instructor-confirm-error" className="text-sm text-destructive" role="alert">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="hero"
                    size="lg"
                    disabled={isLoading}
                    aria-label="Create instructor account"
                  >
                    {isLoading ? "Creating Account..." : "Create Instructor Account"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="student" id="student-register" role="tabpanel">
                <form onSubmit={(e) => handleRegistration(e, "student")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-name">Full Name</Label>
                    <Input
                      id="student-name"
                      name="name"
                      type="text"
                      placeholder="John Smith"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "student-name-error" : undefined}
                    />
                    {errors.name && (
                      <p id="student-name-error" className="text-sm text-destructive" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="student-reg-email">Email</Label>
                    <Input
                      id="student-reg-email"
                      name="email"
                      type="email"
                      placeholder="student@fitcoach.com"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "student-email-error" : undefined}
                    />
                    {errors.email && (
                      <p id="student-email-error" className="text-sm text-destructive" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="student-reg-password">Password</Label>
                    <Input
                      id="student-reg-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "student-password-error" : "student-password-hint"}
                    />
                    {errors.password ? (
                      <p id="student-password-error" className="text-sm text-destructive" role="alert">
                        {errors.password}
                      </p>
                    ) : (
                      <p id="student-password-hint" className="text-xs text-muted-foreground">
                        Min 8 characters with uppercase, lowercase, and number
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="student-confirm-password">Confirm Password</Label>
                    <Input
                      id="student-confirm-password"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={errors.confirmPassword ? "student-confirm-error" : undefined}
                    />
                    {errors.confirmPassword && (
                      <p id="student-confirm-error" className="text-sm text-destructive" role="alert">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    variant="hero"
                    size="lg"
                    disabled={isLoading}
                    aria-label="Create student account"
                  >
                    {isLoading ? "Creating Account..." : "Create Student Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  to="/auth" 
                  className="text-primary hover:underline font-medium"
                  aria-label="Go to sign in page"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}