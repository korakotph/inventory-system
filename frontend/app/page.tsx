"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

type Item = {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  location?: string;
};

export default function Page() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    quantity: 1,
    location: "",
  });
  const [errors, setErrors] = useState<{ name?: string; quantity?: string }>({});

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

  // Fetch items
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE + "/items");
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Open Add Modal
  const openAddModal = () => {
    setEditingItem(null);
    setForm({ name: "", description: "", quantity: 1, location: "" });
    setErrors({});
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item: Item) => {
    setEditingItem(item);
    setForm({ ...item, description: item.description || "", location: item.location || "" });
    setErrors({});
    setModalOpen(true);
  };

  const resetForm = () => {
    setForm({ name: "", description: "", quantity: 1, location: "" });
    setErrors({});
    setEditingItem(null);
  };

  // Handle modal close
  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Submit form
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (form.quantity <= 0) newErrors.quantity = "Quantity must be > 0";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      if (editingItem) {
        await axios.put(`${API_BASE}/items/${editingItem.id}`, {
          ...form,
          quantity: Number(form.quantity),
        });
      } else {
        await axios.post(API_BASE + "/items", { ...form, quantity: Number(form.quantity) });
      }
      closeModal();
      fetchItems();
    } finally {
      setSubmitting(false);
    }
  };

  // Delete item
  const deleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    await axios.delete(API_BASE + "/items/" + id);
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">รายการครุภัณฑ์</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Add Item
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-10">กำลังโหลด...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse shadow-md rounded-lg overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">รายการ</th>
                  <th className="py-3 px-4 text-left">จำนวน</th>
                  <th className="py-3 px-4 text-left">สถานที่</th>
                  <th className="py-3 px-4 text-left">รายละเอียด</th>
                  <th className="py-3 px-4 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-2 px-4">{it.name}</td>
                    <td className="py-2 px-4">{it.quantity}</td>
                    <td className="py-2 px-4">{it.location || "-"}</td>
                    <td className="py-2 px-4">{it.description || "-"}</td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        onClick={() => openEditModal(it)}
                        className="text-green-600 hover:text-green-800 font-medium border-grey-300 p-2 rounded-lg border"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => deleteItem(it.id)}
                        className="text-red-600 hover:text-red-800 font-medium border-red-300 p-2 rounded-lg border"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={closeModal}
        >
          <div
            className="bg-white p-8 rounded-2xl w-full max-w-md relative shadow-lg transform transition-all duration-300 scale-95 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">{editingItem ? "Edit Item" : "Add New Item"}</h2>
            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <input
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="รายการ"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoFocus
                  required
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="number"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.quantity ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="จำนวน"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  required
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>
              <div>
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="สถานที่"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div>
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="รายละเอียด"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition ${
                  submitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={submitting}
              >
                {submitting ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
