import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Users, LogOut, AlertCircle, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  engagement: number;
  status: "active" | "inactive" | "warning";
  lastActive: Date;
}

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const userData = sessionStorage.getItem("fitcoach_user");
    if (!userData) {
      navigate("/auth");
      return;
    }
    
    const parsed = JSON.parse(userData);
    if (parsed.role !== "instructor") {
      navigate("/auth");
      return;
    }
    
    setUser(parsed);
    
    // Mock student data
    setStudents([
      { id: "1", name: "Alex Johnson", engagement: 95, status: "active", lastActive: new Date() },
      { id: "2", name: "Sam Lee", engagement: 72, status: "active", lastActive: new Date() },
      { id: "3", name: "Jordan Smith", engagement: 45, status: "warning", lastActive: new Date() },
      { id: "4", name: "Taylor Brown", engagement: 88, status: "active", lastActive: new Date() },
      { id: "5", name: "Morgan Davis", engagement: 20, status: "inactive", lastActive: new Date() },
    ]);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("fitcoach_user");
    toast({
      title: "Logged out",
      description: "See you next class!",
    });
    navigate("/auth");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success";
      case "warning":
        return "bg-warning";
      case "inactive":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "warning":
        return "Needs attention";
      case "inactive":
        return "Inactive";
      default:
        return "Unknown";
    }
  };

  const avgEngagement = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.engagement, 0) / students.length)
    : 0;

  const activeCount = students.filter(s => s.status === "active").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-bold">FitCoach Instructor</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            aria-label="Log out of instructor dashboard"
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeCount} currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgEngagement}%</div>
              <Progress value={avgEngagement} className="mt-2" aria-label={`Average engagement: ${avgEngagement}%`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {students.filter(s => s.status !== "active").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Students need attention
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Roster</CardTitle>
            <CardDescription>
              Real-time engagement tracking for all participants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="space-y-4" 
              role="list" 
              aria-label="Student engagement list"
            >
              {students.map((student) => (
                <div
                  key={student.id}
                  role="listitem"
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex flex-col">
                      <span className="font-medium">{student.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ID: {student.id}
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(student.status)}
                      aria-label={`Status: ${getStatusLabel(student.status)}`}
                    >
                      {getStatusLabel(student.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right min-w-[120px]">
                      <div className="text-sm font-medium">
                        {student.engagement}% engaged
                      </div>
                      <Progress 
                        value={student.engagement} 
                        className="mt-1"
                        aria-label={`${student.name} engagement: ${student.engagement}%`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div 
          role="status" 
          aria-live="polite" 
          aria-atomic="true" 
          className="sr-only"
          aria-label="Live engagement updates"
        >
          {students.filter(s => s.status === "inactive").length > 0 && (
            `Alert: ${students.filter(s => s.status === "inactive").length} students are inactive`
          )}
        </div>
      </main>
    </div>
  );
}