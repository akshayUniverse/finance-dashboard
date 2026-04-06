import { useState } from "react";
import { X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { transactionCategories } from "../../data/mockData";

const validTypes = new Set(["expense", "income"]);

function cleanText(value) {
  return value.trim().replace(/\s+/g, " ");
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export default function AddTransactionModal({ onClose }) {
  const { addTransaction } = useApp();
  const [values, setValues] = useState({
    amount: "",
    category: "Food",
    date: "",
    description: "",
    type: "expense",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prev) => ({ ...prev, [name]: value }));
    if (error) {
      setError("");
    }
  };

  const handleSubmit = () => {
    const nextTx = {
      ...values,
      description: cleanText(values.description),
    };
    const amount = Number(nextTx.amount);

    if (!nextTx.date || !nextTx.description || !nextTx.amount) {
      setError("Please fill all fields.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    if (!transactionCategories.includes(nextTx.category) || !validTypes.has(nextTx.type)) {
      setError("Please choose a valid type and category.");
      return;
    }

    if (!isValidDate(nextTx.date)) {
      setError("Please choose a valid date.");
      return;
    }

    const added = addTransaction({ ...nextTx, amount });
    if (!added) {
      setError("Couldn't add transaction. Check the form values.");
      return;
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1F2937] rounded-[14px] p-6 w-full max-w-md shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold text-gray-800 dark:text-white font-poppins-semibold">
            Add Transaction
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-[10px] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-gray-500 dark:text-gray-400 font-poppins-medium">Type</label>
              <select
                name="type"
                value={values.type}
                onChange={handleChange}
                className="bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-[10px] px-3 py-2.5 text-[14px] text-gray-800 dark:text-white outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-gray-500 dark:text-gray-400 font-poppins-medium">Category</label>
              <select
                name="category"
                value={values.category}
                onChange={handleChange}
                className="bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-[10px] px-3 py-2.5 text-[14px] text-gray-800 dark:text-white outline-none focus:border-indigo-500 transition-colors"
              >
                {transactionCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-gray-500 dark:text-gray-400 font-poppins-medium">
              {"Amount (\u20b9)"}
            </label>
            <input
              type="number"
              name="amount"
              min="0"
              step="0.01"
              value={values.amount}
              onChange={handleChange}
              placeholder="e.g. 5000"
              className="bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-[10px] px-3 py-2.5 text-[14px] text-gray-800 dark:text-white outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-gray-500 dark:text-gray-400 font-poppins-medium">Date</label>
            <input
              type="date"
              name="date"
              value={values.date}
              onChange={handleChange}
              className="bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-[10px] px-3 py-2.5 text-[14px] text-gray-800 dark:text-white outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-gray-500 dark:text-gray-400 font-poppins-medium">Description</label>
            <input
              type="text"
              name="description"
              maxLength={80}
              value={values.description}
              onChange={handleChange}
              placeholder="e.g. Monthly groceries"
              className="bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-[10px] px-3 py-2.5 text-[14px] text-gray-800 dark:text-white outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-500 text-[12px] bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-[10px]">
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-[10px] border border-gray-200 dark:border-gray-700 text-[14px] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-[10px] bg-indigo-500 hover:bg-indigo-600 text-white text-[14px] font-semibold transition-colors"
            >
              Add Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
