import { Search ,Bell} from 'lucide-react';

export default function Header() {
  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-4 pl-25 md:pl-4 bg-[#111827] border-b border-gray-700 ">
      
      <div className="flex items-center bg-[#1F2937] px-4 py-2 rounded-xl w-1/3">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none ml-2 text-sm w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        
        <Bell className="text-gray-400 cursor-pointer" />

        <select className="bg-[#1F2937] px-3 py-2 rounded-lg text-sm">
          <option>Viewer</option>
          <option>Admin</option>
        </select>

        <div className="w-8 h-8 rounded-full bg-indigo-500"></div>
      </div>
    </div>
  );
}