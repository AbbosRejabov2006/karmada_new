"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Globe,
  GraduationCap,
  Languages,
  Laptop,
  Star,
  TrendingUp,
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
      <section className="w-full py-8 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-950">
  <div className="container px-4 md:px-6">
    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
      <div className="space-y-2">
        <div className="inline-block rounded-lg bg-gray-200 dark:bg-gray-800 px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
          Bizning muvaffaqiyatlar
        </div>
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-gray-900 dark:text-gray-100">
          Karmada bilan muvaffaqiyat yo'li
        </h2>
        <p className="max-w-[900px] text-gray-600 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Minglab haydovchilar Karmada orqali Yevropada yangi hayot boshladilar
        </p>
      </div>
    </div>

    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
      {/* Card 1 */}
      <div className="flex-1 group">
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="relative p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full mb-6 mx-auto">
              <GraduationCap className="h-8 w-8 text-blue-800 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
              Karmada'da o'qib, Yevropada ishlang
            </h3>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Professional tayyorgarlik dasturimiz orqali Yevropa standartlariga mos haydovchi bo'ling. Til kurslari, texnik bilimlar va madaniy tayyorgarlik - hammasi bir joyda.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-blue-700 dark:text-blue-400">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                <span>Professional dastur</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                <span>Xalqaro sertifikat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="flex-1 group">
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="relative p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full mb-6 mx-auto">
              <TrendingUp className="h-8 w-8 text-blue-800 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
              Yuqori maosh va imkoniyatlar
            </h3>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Yevropada haydovchilar uchun oylik maosh 2500-4000 Evro. Qo'shimcha bonuslar, sug'urta, ta'til pullari va oilangiz uchun yashash imkoniyatlari.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-blue-700 dark:text-blue-400">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                <span>2500-4000€/oy</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                <span>Qo'shimcha bonuslar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="flex-1 group">
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="relative p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full mb-6 mx-auto">
              <Users className="h-8 w-8 text-blue-800 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
              Oila uchun yangi imkoniyatlar
            </h3>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Oilangizni ham olib kelish imkoniyati, bolalar uchun bepul ta'lim, tibbiy xizmatlar va Yevropa fuqaroligi olish yo'li.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-blue-700 dark:text-blue-400">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                <span>Oila bilan</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                <span>Bepul ta'lim</span>
              </div>
            </div>
          </div>
        </div>
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
                  className="border-primary-foreground text-black dark:text-white px-8"
                >
                  {t("jobs")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
}
