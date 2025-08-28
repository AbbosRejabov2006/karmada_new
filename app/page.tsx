"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Languages,
  Laptop,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import Header from "@/components/site-header";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509475826633-fed577a2c71b?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center opacity-20 animate-pulse"
          aria-hidden
        />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4 animate-slide-up">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Karmada — Yevropaga yuk mashina haydovchilarini yuborish
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Yevropa davlatlarida ishlash uchun haydovchilarni tanlash,
                  hujjatlarni tayyorlash va ishga joylashtirish.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/jobs">
                  <Button size="lg" className="px-8">
                    {t("jobs")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="px-8">
                    {t("contactUs")}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto animate-fade-in">
              <img
                alt="Karmada trucking recruitment"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                src="https://images.unsplash.com/photo-1509475826633-fed577a2c71b?q=80&w=2071&auto=format&fit=crop"
                width="550"
                height="310"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm animate-fade-in">
                Bizning afzalliklar
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Nega Karmada?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Ish beruvchilar bilan to‘g‘ridan-to‘g‘ri hamkorlik, shaffof
                jarayon va hujjatlarda to‘liq yordam.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow animate-slide-up">
              <div className="rounded-full bg-primary p-3 text-primary-foreground animate-float-soft">
                <Languages className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Talablar va maslahat</h3>
              <p className="text-center text-muted-foreground">
                Intervyu, hujjatlar va yo‘lga tayyorgarlik bo‘yicha maslahat.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow animate-slide-up">
              <div className="rounded-full bg-primary p-3 text-primary-foreground animate-float-soft">
                <Laptop className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">
                Ish beruvchi bilan shartnoma
              </h3>
              <p className="text-center text-muted-foreground">
                Hamkor kompaniyalar bilan rasmiy shartnomalar.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow animate-slide-up">
              <div className="rounded-full bg-primary p-3 text-primary-foreground animate-float-soft">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Vizalar va hujjatlar</h3>
              <p className="text-center text-muted-foreground">
                Viza, ish ruxsati, sug‘urta va yashash joyi bo‘yicha ko‘mak.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow animate-slide-up">
              <div className="rounded-full bg-primary p-3 text-primary-foreground animate-float-soft">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Yo‘nalishlar</h3>
              <p className="text-center text-muted-foreground">
                Polsha, Germaniya, Chexiya va boshqa davlatlar.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow animate-slide-up">
              <div className="rounded-full bg-primary p-3 text-primary-foreground animate-float-soft">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Qo‘llab-quvvatlash</h3>
              <p className="text-center text-muted-foreground">
                Safarga ketishdan oldin va ketgach doimiy yordam.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow animate-slide-up">
              <div className="rounded-full bg-primary p-3 text-primary-foreground animate-float-soft">
                <ArrowRight className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Shaffoflik</h3>
              <p className="text-center text-muted-foreground">
                To‘lovlar va jarayonlar bo‘yicha aniq ma’lumot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs CTA section (replaces courses) */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                {t("jobs")}
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Yevropa davlatlariga yuk mashina haydovchilari uchun ish
                o'rinlari.
              </p>
            </div>
          </div>
          <div className="flex justify-center py-8">
            <Link href="/jobs">
              <Button size="lg" variant="outline">
                {t("jobs")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                {t("registerNow")}
              </h2>
              <p className="max-w-[900px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("registerNowDescription")}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="px-8">
                  {t("register")}
                </Button>
              </Link>
              <Link href="/jobs">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground px-8"
                >
                  {t("jobs")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 md:py-12 bg-background border-t">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">IT English Academy</h3>
              <p className="text-sm text-muted-foreground">
                {t("academyDescription")}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">{t("pages")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t("home")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/courses"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t("courses")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t("about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t("contact")}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">{t("contact")}</h3>
              <ul className="space-y-2">
                <li className="text-sm text-muted-foreground">
                  {t("address")}
                </li>
                <li className="text-sm text-muted-foreground">{t("phone")}</li>
                <li className="text-sm text-muted-foreground">{t("email")}</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">{t("socialMedia")}</h3>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2023 IT English Academy. {t("allRightsReserved")}
          </div>
        </div>
      </footer>
    </div>
  );
}
