import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, LogOut, Video, TrendingUp, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [engagement, setEngagement] = useState(85);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    const userData = sessionStorage.getItem("fitcoach_user");
    if (!userData) {
      navigate("/auth");
      return;
    }
    
    const parsed = JSON.parse(userData);
    if (parsed.role !== "student") {
      navigate("/auth");
      return;
    }
    
    setUser(parsed);
  }, [navigate]);

  useEffect(() => {
    // Simulate real-time engagement updates
    if (isTracking) {
      const interval = setInterval(() => {
        setEngagement(prev => {
          const change = Math.random() * 10 - 5; // Random change between -5 and +5
          const newValue = Math.max(0, Math.min(100, prev + change));
          return Math.round(newValue);
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isTracking]);

  const handleLogout = () => {
    sessionStorage.removeItem("fitcoach_user");
    toast({
      title: "Logged out",
      description: "Great workout! See you next time!",
    });
    navigate("/auth");
  };

  const handleStartTracking = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Stop the stream immediately (we're just checking permission)
      stream.getTracks().forEach(track => track.stop());
      
      setIsTracking(true);
      toast({
        title: "Tracking started",
        description: "Your engagement is being monitored",
      });
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please enable camera access to track engagement",
        variant: "destructive",
      });
    }
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    toast({
      title: "Tracking stopped",
      description: "Great job today!",
    });
  };

  const getEngagementStatus = () => {
    if (engagement >= 80) return { label: "Excellent", color: "bg-success" };
    if (engagement >= 60) return { label: "Good", color: "bg-primary" };
    if (engagement >= 40) return { label: "Fair", color: "bg-warning" };
    return { label: "Needs improvement", color: "bg-destructive" };
  };

  const status = getEngagementStatus();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-bold">FitCoach Student</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {user?.name}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            aria-label="Log out of student dashboard"
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Instructor</CardTitle>
              <CardDescription>Currently teaching</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">JD</span>
                </div>
                <div>
                  <p className="font-semibold text-lg">Jane Doe</p>
                  <p className="text-sm text-muted-foreground">Yoga & HIIT Specialist</p>
                  <Badge variant="outline" className="mt-1 bg-success">
                    Live now
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Stats</CardTitle>
              <CardDescription>Today's performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-semibold">32 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Exercises</span>
                <span className="font-semibold">12 completed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Calories</span>
                <span className="font-semibold">245 kcal</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" aria-hidden="true" />
              Engagement Tracking
            </CardTitle>
            <CardDescription>
              Enable camera to track your movement and engagement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              {!isTracking ? (
                <Button 
                  variant="hero" 
                  size="xl"
                  onClick={handleStartTracking}
                  aria-label="Start engagement tracking"
                >
                  <Video className="mr-2 h-5 w-5" aria-hidden="true" />
                  Start Tracking
                </Button>
              ) : (
                <Button 
                  variant="destructive" 
                  size="xl"
                  onClick={handleStopTracking}
                  aria-label="Stop engagement tracking"
                >
                  Stop Tracking
                </Button>
              )}
            </div>

            {isTracking && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-primary">
                  <div className="text-center">
                    <Video className="h-16 w-16 text-primary mx-auto mb-2" aria-hidden="true" />
                    <p className="text-sm text-muted-foreground">
                      Camera feed (simulated)
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      Current Engagement
                    </span>
                    <Badge className={status.color}>
                      {status.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress 
                      value={engagement} 
                      className="flex-1"
                      aria-label={`Engagement level: ${engagement}%`}
                    />
                    <span className="text-2xl font-bold min-w-[60px] text-right">
                      {engagement}%
                    </span>
                  </div>
                </div>

                <div 
                  role="status" 
                  aria-live="polite" 
                  className="text-center p-4 bg-muted rounded-lg"
                >
                  <TrendingUp className="h-5 w-5 text-success mx-auto mb-2" aria-hidden="true" />
                  <p className="text-sm">
                    {engagement >= 80 && "Excellent form! Keep it up! 💪"}
                    {engagement >= 60 && engagement < 80 && "Good work! Try to maintain this pace."}
                    {engagement >= 40 && engagement < 60 && "You can do it! Push a little harder."}
                    {engagement < 40 && "Need some motivation? Let's get moving!"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy & Data</CardTitle>
            <CardDescription>
              Your privacy is our priority
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Video is processed locally on your device</p>
            <p>• No video data is uploaded to servers</p>
            <p>• Only engagement scores are shared with your instructor</p>
            <p>• All data is encrypted and deleted after each session</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}