"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [applications, setApplications] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  // After component mounts, we can access translations
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("jobApplications");
      if (stored) {
        const all = JSON.parse(stored);
        const mine = all.filter((a: any) => a.email && a.email === user?.email);
        setApplications(mine);
      } else {
        setApplications([]);
      }
    } catch (e) {
      setApplications([]);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated || !mounted) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  const statusLabel = (s: string) => {
    switch (s) {
      case "new":
        return t("statusNew");
      case "reviewed":
        return t("statusReviewed");
      case "interviewed":
        return t("statusInterviewed");
      case "accepted":
        return t("statusAccepted");
      case "rejected":
        return t("statusRejected");
      default:
        return s;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center">
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t("profile_completion")}
                    </span>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{t("student")}</Badge>
                  <Badge variant="outline">{t("english_b2")}</Badge>
                  <Badge variant="outline">{t("it_beginner")}</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/profile/settings")}
              >
                {t("edit_profile")}
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t("quick_links")}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="grid gap-2">
                {/* Removed courses and certificates quick links */}
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => router.push("/profile/chat")}
                >
                  {t("support_chat")}
                </Button>
                {/* Removed browse courses */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
              <TabsTrigger value="applications">
                {t("myApplications")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("welcome_back")}</CardTitle>
                  <CardDescription>
                    {t("welcome_message", { name: user?.name || "" })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">
                          {t("totalApplications")}
                        </h3>
                        <p className="text-3xl font-bold">
                          {applications.length}
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">
                          {t("applicationStatus")}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {[
                            {
                              k: "statusNew",
                              v: applications.filter((a) => a.status === "new")
                                .length,
                            },
                            {
                              k: "statusReviewed",
                              v: applications.filter(
                                (a) => a.status === "reviewed"
                              ).length,
                            },
                            {
                              k: "statusInterviewed",
                              v: applications.filter(
                                (a) => a.status === "interviewed"
                              ).length,
                            },
                            {
                              k: "statusAccepted",
                              v: applications.filter(
                                (a) => a.status === "accepted"
                              ).length,
                            },
                            {
                              k: "statusRejected",
                              v: applications.filter(
                                (a) => a.status === "rejected"
                              ).length,
                            },
                          ]
                            .filter((x) => x.v > 0)
                            .map((x) => `${t(x.k)}: ${x.v}`)
                            .join(" • ") || t("statusNew")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="applications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("myApplications")}</CardTitle>
                  <CardDescription>{t("recentApplications")}</CardDescription>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t("noJobsFound")}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {applications
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.submittedAt).getTime() -
                            new Date(a.submittedAt).getTime()
                        )
                        .slice(0, 10)
                        .map((a) => (
                          <div
                            key={a.id}
                            className="flex items-center justify-between border rounded-md p-3"
                          >
                            <div>
                              <div className="font-medium">{a.jobTitle}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(a.submittedAt).toLocaleDateString()}
                              </div>
                            </div>
                            <Badge variant="outline">
                              {statusLabel(a.status)}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
