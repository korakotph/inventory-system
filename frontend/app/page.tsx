"use client";

import React, { useEffect, useState } from 'react'
import axios from 'axios'

type Item = {
  id: number
  name: string
  description?: string
  quantity: number
  location?: string
}

export default function Page() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', quantity: 1, location: '' })

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'

  async function fetchItems() {
    setLoading(true)
    try {
      const r = await axios.get(API_BASE + '/items')
      setItems(r.data)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchItems() }, [])

  async function createItem(e: React.FormEvent) {
    e.preventDefault()
    await axios.post(API_BASE + '/items', { ...form, quantity: Number(form.quantity) })
    setForm({ name: '', description: '', quantity: 1, location: '' })
    fetchItems()
  }

  async function deleteItem(id: number) {
    await axios.delete(API_BASE + '/items/' + id)
    fetchItems()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold mb-4">Inventory</h1>

        <form onSubmit={createItem} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <input className="p-2 border rounded" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
          <input className="p-2 border rounded" placeholder="Location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} />
          <input type="number" className="p-2 border rounded" placeholder="Quantity" value={form.quantity} onChange={e=>setForm({...form, quantity: Number(e.target.value)})} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
        </form>

        {loading ? <div>Loading...</div> : (
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="border-b"><th>Name</th><th>Qty</th><th>Location</th><th></th></tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{it.name}</td>
                  <td>{it.quantity}</td>
                  <td>{it.location}</td>
                  <td><button onClick={() => deleteItem(it.id)} className="text-red-600">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  )
}
