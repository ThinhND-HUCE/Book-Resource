import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { createStudent, getAllStudents, importStudentsFromExcel } from "../constants/apiService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaListUl } from "react-icons/fa";

const Wrapper = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  justify-content: center;
  padding: 40px 16px;
`;

const CardSection = styled.div`
  background: #f1f5f9;
  padding: 20px 24px;
  border-radius: 12px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  background-color: #e2e8f0;
  color: #1e293b;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  border: 1px solid #cbd5e1;

  &:hover {
    background-color: #cbd5e1;
  }
`;

const FileName = styled.span`
  font-size: 0.9rem;
  color: #334155;
  font-style: italic;
`;



const Page = styled.div`
  background: white;
  width: 100%;
  max-width: 720px;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const LogoutBtn = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const TabBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const Tab = styled.button<{ active: boolean }>`
  align-items: center;
  display: flex;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  background-color: ${({ active }) => (active ? "#0d6efd" : "#e2e8f0")};
  color: ${({ active }) => (active ? "#fff" : "#1e293b")};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ active }) => (active ? "#0b5ed7" : "#cbd5e1")};
  }
`;

const Input = styled.input`
  width: 96.5%;
  display: block;
  margin: 5px 0 12px 0;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: #0d6efd;
  }
`;

const Select = styled.select`
  width: 100%;
  margin-top: 5px;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: #0d6efd;
  }
`;

const StyledButton = styled.button`
  background-color: #0d6efd;
  color: white;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 0.95rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-top: 12px;

  &:hover {
    background-color: #0b5ed7;
  }
`;



const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`;

const Th = styled.th`
  background-color: #f1f5f9;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
`;

const Td = styled.td`
  padding: 12px;
  border: 1px solid #dee2e6;
  border-bottom: 1px solid #e2e8f0;
  text-align: center;
`;

const UserManagement = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"create" | "list">("create");
  const [form, setForm] = useState({
    mssv: "",
    email: "",
    password: "",
    role: "student",
    firstName: "",
    lastName: "",
    phone: "",
    studentClass: "",
    is_first_login: true
  });
  const [users, setUsers] = useState<any[]>([]);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (tab === "list") {
      fetchUsers(1); // 👈 load trang đầu
    }
  }, [tab]);

  const fetchUsers = async (page: number) => {
    try {
      const res = await getAllStudents(page);
      setUsers(res.results);                    // ✅ Cập nhật danh sách users
      setTotalPages(Math.ceil(res.count / 20)); // ✅ Cập nhật số trang
      setCurrentPage(page);                     // ✅ Cập nhật trang hiện tại
    } catch (err) {
      toast.error("🚫 Không thể tải danh sách người dùng", { autoClose: 3000 });
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!excelFile) return;

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      const res = await importStudentsFromExcel(formData); // gọi từ service
      if (res.success) {
        toast.success(`✅ Import thành công: ${res.users?.length || 0} tài khoản`);
      } else {
        toast.error("❌ " + res.message || "Lỗi không xác định");
      }
    } catch (error) {
      toast.error("🚫 Lỗi khi import Excel");
      console.error(error);
    }
  };


  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createStudent({
        student_id: form.mssv,
        username: form.mssv,
        email: form.email,
        password: form.password,
        role: form.role,
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        classname: form.studentClass,
        is_first_login: true,
      });

      if (res.success) {
        toast.success("✅ Tạo tài khoản thành công!");
        setForm({
          mssv: "",
          email: "",
          password: "",
          role: "student",
          firstName: "",
          lastName: "",
          phone: "",
          studentClass: "",
          is_first_login: true
        });
      } else {
        toast.error("❌ " + res.data.message);
      }
    } catch (err) {
      toast.error("🚫 Lỗi khi gọi API");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <Wrapper>
      <Page>
        <Header>
          <Title>Quản lý người dùng</Title>
          <LogoutBtn onClick={handleLogout}>Đăng xuất</LogoutBtn>
        </Header>

        <TabBar>
          <Tab active={tab === "create"} onClick={() => setTab("create")}><FaPlus /> Tạo tài khoản </Tab>
          <Tab active={tab === "list"} onClick={() => setTab("list")}><FaListUl /> Danh sách người dùng</Tab>
          {/* <Tab active={tab === "import"} onClick={() => setTab("import")}></Tab> */}
        </TabBar>

        {tab === "create" && (
  <div>
    {/* PHẦN IMPORT EXCEL */}
    <CardSection>
      <h4 style={{ marginBottom: "16px" }}>📥 Import tài khoản từ Excel</h4>
      <form onSubmit={handleFileUpload}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px"
        }}>
          <FileInputWrapper style={{ flexGrow: 1 }}>
            <FileLabel htmlFor="excel-upload">📁 Chọn file Excel</FileLabel>
            <HiddenFileInput
              id="excel-upload"
              type="file"
              accept=".xlsx"
              onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
            />
            <FileName>
              {excelFile ? excelFile.name : "Chưa chọn file nào"}
            </FileName>
          </FileInputWrapper>

          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <StyledButton type="submit">
            Import từ Excel
          </StyledButton>
          </div>

        </div>
      </form>
    </CardSection>

    {/* PHẦN TẠO TÀI KHOẢN */}
    <CardSection>
      <form onSubmit={handleCreate}>
        <label>Mã số sinh viên</label>
        <Input
          name="mssv"
          value={form.mssv}
          onChange={(e) => setForm({ ...form, mssv: e.target.value })}
          required
        />
        <label>Email</label>
        <Input
          type="email"
          name="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <label>Mật khẩu</label>
        <Input
          type="password"
          name="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <label>Họ</label>
        <Input
          name="lastName"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
        <label>Tên</label>
        <Input
          name="firstName"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
        <label>Số điện thoại</label>
        <Input
          name="phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <label>Lớp</label>
        <Input
          name="studentClass"
          value={form.studentClass}
          onChange={(e) => setForm({ ...form, studentClass: e.target.value })}
        />
        <label>Vai trò</label>
        <Select
          name="role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
          <option value="teacher">Teacher</option>
        </Select>

        {/* ✅ Nút tạo tài khoản nằm gọn trong form */}
        <div style={{ textAlign: "right", marginTop: "16px" }}>
          <StyledButton type="submit">Tạo tài khoản</StyledButton>
        </div>
      </form>
    </CardSection>
  </div>
)}



        {tab === "list" && (
          <>
            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Tên tài khoản</Th>
                  <Th>Email</Th>
                  <Th>Số điện thoại</Th>
                  <Th>Lớp</Th>
                  <Th>Vai trò</Th>
                  <Th>Lần đầu đăng nhập</Th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <Td>{u.id}</Td>
                    <Td>{u.username}</Td>
                    <Td>{u.email}</Td>
                    <Td>{u.phone}</Td>
                    <Td>{u.classname ? u.classname : "null"}</Td>
                    <Td>{u.role}</Td>
                    <Td>{u.is_first_login ? "✅" : "❌"}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Pagination controls */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => fetchUsers(i + 1)}
                  style={{
                    margin: "0 4px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    background: currentPage === i + 1 ? "#0d6efd" : "#fff",
                    color: currentPage === i + 1 ? "#fff" : "#000",
                    cursor: "pointer",
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </Page>
    </Wrapper>
  );
};

export default UserManagement;
