import { Users, BookOpen, BarChart } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Bảng Điều Khiển</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-5 flex items-center space-x-4">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">Tổng sinh viên</p>
            <p className="text-xl font-semibold text-gray-800">120</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 flex items-center space-x-4">
          <BookOpen className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-gray-500 text-sm">Số lớp học</p>
            <p className="text-xl font-semibold text-gray-800">8</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 flex items-center space-x-4">
          <BarChart className="w-8 h-8 text-purple-600" />
          <div>
            <p className="text-gray-500 text-sm">Hoạt động gần đây</p>
            <p className="text-xl font-semibold text-gray-800">5 cập nhật</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Hoạt động gần đây</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>✅ Sinh viên Nguyễn Văn A đã được thêm vào lớp CNTT1</li>
          <li>🕒 Lớp KTPM2 vừa cập nhật sĩ số</li>
          <li>➕ Lớp mới “Thiết kế Web” vừa được tạo</li>
        </ul>
      </div>
    </div>
  )
}
