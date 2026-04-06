import { cloneElement, useState } from "react";
import { Search, ArrowUpDown, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { categoryColors } from "../../data/mockData";
import AddTransactionModal from "./AddTransactionModal";

const sortIcons = {
  amount: <ArrowUpDown size={14} className="text-gray-400" />,
  date: <ArrowUpDown size={14} className="text-gray-400" />,
};

export default function TransactionsTable() {
  const { transactions, role } = useApp();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [modalOpen, setModalOpen] = useState(false);
  const searchTerm = query.trim().toLowerCase();

  const filteredRows = transactions.filter((tx) => {
    const matchSearch =
      tx.description.toLowerCase().includes(searchTerm) ||
      tx.category.toLowerCase().includes(searchTerm);
    const matchType = typeFilter === "all" || tx.type === typeFilter;

    return matchSearch && matchType;
  });

  const rows = [...filteredRows].sort((a, b) => {
    if (sortBy === "date") {
      const diff = new Date(a.date) - new Date(b.date);
      return sortOrder === "asc" ? diff : -diff;
    }

    if (sortBy === "amount") {
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }

    return 0;
  });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(field);
    setSortOrder("desc");
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) {
      return sortIcons[field];
    }

    const icon =
      sortOrder === "asc"
        ? <ArrowUp size={14} className="text-indigo-500" />
        : <ArrowDown size={14} className="text-indigo-500" />;

    return cloneElement(icon, { key: `${field}-${sortOrder}` });
  };

  return (
    <>
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-gray-800 dark:text-white font-poppins-semibold">
              Transactions
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {rows.length} records found
            </p>
          </div>

          {role === "Admin" && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl transition-colors font-medium"
            >
              <Plus size={16} />
              Add Transaction
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#1F2937] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 flex-1 min-w-[180px]">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none w-full placeholder:text-gray-400"
            />
          </div>

          <div className="flex gap-2">
            {["all", "income", "expense"].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
                  typeFilter === type
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 dark:bg-[#1F2937] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1F2937]">
                <th
                  onClick={() => toggleSort("date")}
                  className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 font-medium cursor-pointer hover:text-indigo-500 transition-colors rounded-l-xl"
                >
                  <div className="flex items-center gap-1">
                    Date {getSortIcon("date")}
                  </div>
                </th>
                <th className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">
                  Description
                </th>
                <th className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">
                  Type
                </th>
                <th
                  onClick={() => toggleSort("amount")}
                  className="text-right px-4 py-3 text-gray-500 dark:text-gray-400 font-medium cursor-pointer hover:text-indigo-500 transition-colors rounded-r-xl"
                >
                  <div className="flex items-center justify-end gap-1">
                    Amount {getSortIcon("amount")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 dark:text-gray-500">
                    <p className="text-2xl mb-2">{"\u{1F50D}"}</p>
                    <p className="font-medium">No transactions found</p>
                    <p className="text-xs mt-1">Try changing your search or filter</p>
                  </td>
                </tr>
              ) : (
                rows.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-[#1F2937] transition-colors">
                    <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3.5 text-gray-800 dark:text-gray-200 font-medium">
                      {tx.description}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: categoryColors[tx.category] || "#6366f1" }}
                      >
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          tx.type === "income"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3.5 text-right font-bold whitespace-nowrap ${
                        tx.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {"\u20b9"}
                      {tx.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && <AddTransactionModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
