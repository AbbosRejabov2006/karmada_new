"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNotification } from "@/context/notification-context";
import { useAdminLanguage } from "@/context/admin-language-context";

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const { addNotification } = useNotification();
  const courseId = Number.parseInt(params.id);
  const { t } = useAdminLanguage();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    level: "Boshlang'ich",
    duration: "",
    lessons: "",
    price: "",
    instructor: "",
    instructorTitle: "",
    status: "Rejada",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load course data
    const loadCourse = () => {
      try {
        const courses = JSON.parse(localStorage.getItem("courses") || "[]");
        const course = courses.find((c: any) => c.id === courseId);

        if (course) {
          setFormData({
            title: course.title || "",
            description: course.description || "",
            longDescription: course.longDescription || "",
            level: course.level || "Boshlang'ich",
            duration: course.duration || "",
            lessons: course.lessons?.toString() || "",
            price: course.price || "",
            instructor: course.instructor || "",
            instructorTitle: course.instructorTitle || "",
            status: course.status || "Rejada",
          });
        } else {
          toast({
            title: "Xatolik",
            description: "Kurs topilmadi",
            variant: "destructive",
          });
          router.push("/admin/courses");
        }
      } catch (error) {
        console.error("Failed to load course:", error);
        toast({
          title: "Xatolik",
          description: "Kursni yuklashda xatolik yuz berdi",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId, router, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.title || !formData.description || !formData.price) {
      toast({
        title: "Xatolik",
        description: "Kurs nomi, tavsifi va narxi to'ldirilishi shart",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // In a real app, this would be an API call to update the course
    setTimeout(() => {
      try {
        // Get existing courses from localStorage
        const courses = JSON.parse(localStorage.getItem("courses") || "[]");
        const updatedCourses = courses.map((c: any) =>
          c.id === courseId
            ? {
                ...c,
                ...formData,
                lessons: Number.parseInt(formData.lessons || "0") || 0,
                price: Number.parseFloat(formData.price || "0") || 0,
              }
            : c
        );
        localStorage.setItem("courses", JSON.stringify(updatedCourses));

        addNotification({
          type: "success",
          title: t("success"),
          message: t("courseUpdatedSuccessfully"),
        });

        toast({
          title: t("success"),
          description: t("courseUpdatedSuccessfully"),
        });
        router.push("/admin/courses");
      } catch (error) {
        console.error("Failed to update course:", error);
        toast({
          title: t("error"),
          description: t("updateCourseError"),
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <div className="container py-6">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/admin/courses"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 inline-block h-4 w-4" /> {t("back")}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("editCourse")}</CardTitle>
          <CardDescription>{t("editCourseDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
            onSubmit={handleSubmit}
          >
            <div>
              <Label htmlFor="title">{t("courseTitle")}</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="level">{t("level")}</Label>
              <Select
                value={formData.level}
                onValueChange={(v) => handleSelectChange("level", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("level")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Boshlang'ich">{t("beginner")}</SelectItem>
                  <SelectItem value="O'rta">{t("intermediate")}</SelectItem>
                  <SelectItem value="Yuqori">{t("advanced")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">{t("shortDescription")}</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="longDescription">{t("longDescription")}</Label>
              <Textarea
                id="longDescription"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="duration">{t("duration")}</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="lessons">{t("lessons")}</Label>
              <Input
                id="lessons"
                name="lessons"
                value={formData.lessons}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="price">{t("price")}</Label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="instructor">{t("instructor")}</Label>
              <Input
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="instructorTitle">{t("instructorTitle")}</Label>
              <Input
                id="instructorTitle"
                name="instructorTitle"
                value={formData.instructorTitle}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="status">{t("status")}</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => handleSelectChange("status", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rejada">{t("planned")}</SelectItem>
                  <SelectItem value="Faol">{t("active")}</SelectItem>
                  <SelectItem value="Arxiv">{t("archived")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/courses")}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />{" "}
                {isSubmitting ? t("saving") : t("save")}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          {isLoading ? t("loading") : t("readyToEdit")}
        </CardFooter>
      </Card>
    </div>
  );
}
