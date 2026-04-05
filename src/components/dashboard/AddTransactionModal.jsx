import { useState } from "react";
import { X } from "lucide-react";
import { useApp } from "../../context/AppContext";

const CATEGORIES = ["Salary", "Freelance", "Food", "Travel", "Bills", "Shopping"];

export default function AddTransactionModal({ onClose }) {
  const { addTransaction } = useApp();

  const [form, setForm] = useState({
    date:        "",
    amount:      "",
    category:    "Food",
    type:        "expense",
    description: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!form.date || !form.amount || !form.description) {
      setError("Please fill all fields.");
      return;
    }
    if (isNaN(form.amount) || Number(form.amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    addTransaction({ ...form, amount: Number(form.amount) });
    onClose();
  };

  return (
    // Backdrop — clicking outside closes modal
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal box — stop click from closing when clicking inside */}
      <div
        className="bg-white dark:bg-[#1F2937] rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white font-poppins-semibold">
            Add Transaction
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-4">

          <div className="grid grid-cols-2 gap-4">
            {/* Type */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none focus:border-indigo-500 transition-colors"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="e.g. 5000"
              className="bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Monthly groceries"
              className="bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-xs bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors"
            >
              Add Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}   