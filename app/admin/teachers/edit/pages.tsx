"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function EditTeacherPage() {
  const { id } = useParams() // URL dan ID olish
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    subject: "",
    phone: "",
  })

  useEffect(() => {
    // Backend yoki local API dan ma’lumot olish
    async function fetchTeacher() {
      try {
        const res = await fetch(`/api/teachers/${id}`)
        if (!res.ok) throw new Error("Teacher not found")
        const data = await res.json()
        setForm(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchTeacher()
  }, [id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch(`/api/teachers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Update failed")
      router.push("/admin/teachers")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">Edit Teacher</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 border rounded"
        />
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Subject"
          className="w-full p-2 border rounded"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}
