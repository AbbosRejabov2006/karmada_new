"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditTeacherPage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const [teacher, setTeacher] = useState<any>(null)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    status: "",
  })

  useEffect(() => {
    const storedTeachers = localStorage.getItem("teachers")
    if (storedTeachers && id) {
      const teachers = JSON.parse(storedTeachers)
      const found = teachers.find((t: any) => t.id === Number(id))
      setTeacher(found)
      if (found) {
        setForm({
          name: found.name || "",
          email: found.email || "",
          phone: found.phone || "",
          specialty: found.specialty || "",
          status: found.status || "",
        })
      }
    }
  }, [id])

  if (!teacher) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        O‘qituvchi topilmadi
      </div>
    )
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    const storedTeachers = localStorage.getItem("teachers")
    if (storedTeachers && id) {
      const teachers = JSON.parse(storedTeachers)
      const idx = teachers.findIndex((t: any) => t.id === Number(id))
      if (idx !== -1) {
        teachers[idx] = { ...teachers[idx], ...form }
        localStorage.setItem("teachers", JSON.stringify(teachers))
        router.push("/admin/teachers")
      }
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800">
        {form.name} — Tahrirlash
      </h1>

      <div className="space-y-6">
        {/** Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            To‘liq ism
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="To‘liq ismni kiriting"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/** Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Elektron pochta manzili"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/** Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Telefon
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Telefon raqamini kiriting"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/** Specialty */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Mutaxassislik
          </label>
          <input
            type="text"
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            placeholder="Mutaxassislikni kiriting"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/** Status */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Holat
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="active">Faol</option>
            <option value="inactive">Faol emas</option>
          </select>
        </div>

        {/** Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm transition"
          >
            Saqlash
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/teachers")}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-xl shadow-sm transition"
          >
            Orqaga
          </button>
        </div>
      </div>
    </div>
  )
}
