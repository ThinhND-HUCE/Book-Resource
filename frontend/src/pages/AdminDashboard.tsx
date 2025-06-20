import React, { useState } from "react";
import styled from "styled-components";

// Styled Components
const PageWrapper = styled.div`
  max-width: 900px;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 40px;
`;

const TabBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  background-color: ${({ active }) => (active ? "#007bff" : "#e2e8f0")};
  color: ${({ active }) => (active ? "#fff" : "#333")};
  border: none;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: ${({ active }) => (active ? "#0062cc" : "#cbd5e0")};
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 30px;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 16px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const StyledButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 16px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`;

const Th = styled.th`
  background-color: #f8f9fa;
  padding: 12px;
  text-align: left;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.75rem;
  border-bottom: 1px solid #dee2e6;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Action = styled.button`
  font-size: 0.85rem;
  font-weight: 600;
  color: #007bff;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &.delete {
    color: #dc3545;
  }
`;

// Component Logic
const UserManagement = () => {
  const [activeTab, setActiveTab] = useState<"create" | "list">("create");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [users, setUsers] = useState([
    { id: 1, username: "admin", email: "admin@example.com", role: "admin" },
    { id: 2, username: "hung123", email: "hung@gmail.com", role: "student" },
  ]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: users.length + 1,
      username: formData.username,
      email: formData.email,
      role: "student",
    };
    setUsers([...users, newUser]);
    setFormData({ username: "", email: "", password: "" });
    alert("✅ Tạo tài khoản thành công!");
  };

  return (
    <PageWrapper>
      <Title>Quản lý người dùng</Title>

      <TabBar>
        <TabButton
          active={activeTab === "create"}
          onClick={() => setActiveTab("create")}
        >
          🧑‍🎓 Tạo tài khoản sinh viên
        </TabButton>
        <TabButton
          active={activeTab === "list"}
          onClick={() => setActiveTab("list")}
        >
          🛠️ Quản lý người dùng
        </TabButton>
      </TabBar>

      <Section>
        {activeTab === "create" && (
          <form onSubmit={handleCreateUser}>
            <Label>Tên đăng nhập</Label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleFormChange}
              placeholder="student123"
              required
            />

            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="student@example.com"
              required
            />

            <Label>Mật khẩu</Label> 
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              placeholder="••••••••"
              required
            />

            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <StyledButton type="submit">Tạo tài khoản</StyledButton>
            </div>
          </form>
        )}

        {activeTab === "list" && (
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Username</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th style={{ textAlign: "right" }}>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.username}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.role}</Td>
                  <Td>
                    <ActionButtons>
                      <Action>Sửa</Action>
                      <Action className="delete">Xoá</Action>
                    </ActionButtons>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Section>
    </PageWrapper>
  );
};

export default UserManagement;
