import { cloneElement, useState } from "react";
import { Search, ArrowUpDown, Plus, ArrowUp, ArrowDown, SquarePen } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { categoryColors } from "../../data/mockData";
import AddTransactionModal from "./AddTransactionModal";
import {
  formatCurrency,
  formatTransactionDate,
  getTransactionPrimaryText,
  getTransactionSearchText,
  getTransactionSecondaryText,
} from "../../utils/finance";

const sortIcons = {
  amount: <ArrowUpDown size={14} className="text-gray-400" />,
  date: <ArrowUpDown size={14} className="text-gray-400" />,
};

export default function TransactionsTable() {
  const { transactions, role } = useApp();
  const isAdmin = role === "Admin";
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const searchTerm = query.trim().toLowerCase();

  const filteredRows = transactions.filter((tx) => {
    const matchSearch = !searchTerm || getTransactionSearchText(tx).includes(searchTerm);
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
      <div className="surface-panel flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="section-title">Transactions</h2>
            <p className="section-subtitle">{rows.length} records found</p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-[14px] px-4 py-2 rounded-[10px] transition-colors font-poppins-medium"
            >
              <Plus size={16} />
              Add Transaction
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="field-shell flex items-center gap-2 px-3 py-2 flex-1 min-w-[180px]">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="bg-transparent text-[14px] text-gray-700 dark:text-gray-200 outline-none w-full placeholder:text-gray-400"
            />
          </div>

          <div className="flex gap-2">
            {["all", "income", "expense"].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-2 rounded-[10px] text-[12px] font-poppins-semibold capitalize transition-colors ${
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

        <div className="overflow-x-auto rounded-[10px]">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1F2937]">
                <th
                  onClick={() => toggleSort("date")}
                  className="table-head-cell cursor-pointer hover:text-indigo-500 transition-colors rounded-l-xl"
                >
                  <div className="flex items-center gap-1">
                    Date {getSortIcon("date")}
                  </div>
                </th>
                <th className="table-head-cell">
                  Description
                </th>
                <th className="table-head-cell">
                  Category
                </th>
                <th className="table-head-cell">
                  Type
                </th>
                {isAdmin && (
                  <th className="table-head-cell">
                    Actions
                  </th>
                )}
                <th
                  onClick={() => toggleSort("amount")}
                  className={`table-head-cell text-right cursor-pointer hover:text-indigo-500 transition-colors ${
                    isAdmin ? "" : "rounded-r-xl"
                  }`}
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
                  <td colSpan={isAdmin ? 6 : 5} className="text-center py-12 text-gray-400 dark:text-gray-500">
                    <p className="text-[24px] mb-2">{"\u{1F50D}"}</p>
                    <p className="font-poppins-medium">No transactions found</p>
                    <p className="text-[12px] mt-1">Try changing your search or filter</p>
                  </td>
                </tr>
              ) : (
                rows.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-[#1F2937] transition-colors">
                    <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {formatTransactionDate(tx.date)}
                    </td>
                    <td className="px-4 py-3.5 min-w-[230px]">
                      <p className="body-text font-poppins-medium">{getTransactionPrimaryText(tx)}</p>
                      {getTransactionSecondaryText(tx) && (
                        <p className="caption-text mt-1">{getTransactionSecondaryText(tx)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="tag-pill text-white"
                        style={{ backgroundColor: categoryColors[tx.category] || "#6366f1" }}
                      >
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`tag-pill ${
                          tx.type === "income"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => setEditingTx(tx)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 text-[12px] font-poppins-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                        >
                          <SquarePen size={13} />
                          Edit
                        </button>
                      </td>
                    )}
                    <td
                      className={`px-4 py-3.5 text-right font-poppins-bold whitespace-nowrap ${
                        tx.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && <AddTransactionModal onClose={() => setModalOpen(false)} />}
      {editingTx && (
        <AddTransactionModal
          initialValues={editingTx}
          mode="edit"
          onClose={() => setEditingTx(null)}
        />
      )}
    </>
  );
}
