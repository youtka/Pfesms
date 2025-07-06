import React, { useEffect, useState } from "react";
import axios from "axios";
import UserSidebarLayout from "./UserSidebarLayout";

const btnStyle = {
  borderRadius: "1.5rem",
  fontWeight: 600,
  fontSize: "1rem",
  boxShadow: "none",
};

const inputStyle = {
  borderRadius: "1.2rem",
  fontSize: "1rem",
  padding: "0.7rem 1rem",
  background: "#f7fafd",
  border: "1px solid #eee",
  color: "#333",
};

const cardStyle = {
  borderRadius: "22px",
  boxShadow: "0 4px 28px rgba(0,0,0,0.09)",
  border: "none",
  background: "#fff",
};

const listItemStyle = (active) => ({
  border: "none",
  background: active ? "#007bff" : "none",
  color: active ? "#fff" : "#333",
  borderRadius: "15px",
  marginBottom: "9px",
  fontWeight: 500,
  fontSize: "16px",
  transition: "background 0.2s, color 0.2s",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  padding: "0.68rem 0.7rem",
});

const tableHeadStyle = { color: "#333", background: "#f8fafc", fontSize: "15px", fontWeight: 700 };
const tableTdStyle = { fontSize: "15px", color: "#444", verticalAlign: "middle", borderTop: "none" };

const CategoriesAndNumbers = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [newNumber, setNewNumber] = useState({ fullName: "", phoneNumber: "" });
  const [editingNumberId, setEditingNumberId] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: "", phoneNumber: "" });
  const [phoneWarning, setPhoneWarning] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    if (selectedCategoryId && selectedCategoryId !== "ALL") {
      fetchNumbers(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const fetchCategories = () => {
    axios
      .get("http://localhost:9190/api/category/all", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setCategories(res.data);
        if (res.data.length > 0) setSelectedCategoryId(res.data[0].id);
      })
      .catch((err) => console.error("❌ Failed to fetch categories", err));
  };

  const fetchNumbers = (categoryId) => {
    axios
      .get(`http://localhost:9190/api/number/by-category/${categoryId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setNumbers(res.data))
      .catch((err) => console.error("❌ Failed to fetch numbers", err));
  };

  const fetchAllNumbers = () => {
    axios
      .get("http://localhost:9190/api/number/all", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setNumbers(res.data))
      .catch(() => alert("❌ Failed to fetch all numbers"));
  };

  const isValidMoroccanNumber = (num) => /^\+212[5-9]\d{8}$/.test(num);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    axios
      .post("http://localhost:9190/api/category/create", { name: newCategoryName }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setNewCategoryName("");
        fetchCategories();
      })
      .catch(() => alert("❌ Failed to add category"));
  };

  const handleDeleteCategory = (id) => {
    if (id === "ALL") return;
    if (!window.confirm("Are you sure?")) return;
    axios
      .delete(`http://localhost:9190/api/category/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        if (id === selectedCategoryId) setSelectedCategoryId(null);
        fetchCategories();
      })
      .catch(() => alert("❌ Failed to delete category"));
  };

  const handleEditCategory = (cat) => {
    if (cat.id === "ALL") return;
    setEditingCategoryId(cat.id);
    setEditCategoryName(cat.name);
  };

  const handleSaveCategoryEdit = (id) => {
    axios
      .put(`http://localhost:9190/api/category/update/${id}`, { name: editCategoryName }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setEditingCategoryId(null);
        setEditCategoryName("");
        fetchCategories();
      })
      .catch(() => alert("❌ Failed to rename category"));
  };

  const handleAddNumber = () => {
    if (!newNumber.fullName || !newNumber.phoneNumber) return alert("❗ Fill all fields");
    if (!isValidMoroccanNumber(newNumber.phoneNumber)) {
      setPhoneWarning("⚠️ Phone number must start with +212 and be exactly 13 characters.");
      return;
    }
    setPhoneWarning("");
    axios
      .post("http://localhost:9190/api/number/add", { ...newNumber, categoryId: selectedCategoryId }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setNewNumber({ fullName: "", phoneNumber: "" });
        fetchNumbers(selectedCategoryId);
      })
      .catch(() => alert("❌ Failed to add number"));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure?")) return;
    axios
      .delete(`http://localhost:9190/api/number/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => fetchNumbers(selectedCategoryId))
      .catch(() => alert("❌ Failed to delete"));
  };

  const handleEdit = (n) => {
    setEditingNumberId(n.id);
    setEditForm({ fullName: n.fullName, phoneNumber: n.phoneNumber });
  };

  const handleEditSave = (id) => {
    axios
      .put(`http://localhost:9190/api/number/update/${id}`, { ...editForm, categoryId: selectedCategoryId }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setEditingNumberId(null);
        fetchNumbers(selectedCategoryId);
      })
      .catch(() => alert("❌ Failed to update"));
  };

  const handleExportCSV = () => {
    if (!numbers.length) return alert("No numbers to export");
    const csvContent = "Full Name,Phone Number\n" + numbers.map((n) => `${n.fullName},${n.phoneNumber}`).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "numbers.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <UserSidebarLayout>
      <div className="container py-5">
        <h3 className="mb-4 fw-bold" style={{ color: "#1E90FF" }}>
          <span role="img" aria-label="folders">📂</span> Categories & Numbers
        </h3>
        <div className="row g-4">
          {/* Categories */}
          <div className="col-md-4">
            <div className="card shadow-sm border-0" style={cardStyle}>
              <div className="card-body p-4">
                <h5 className="fw-semibold mb-3" style={{ color: "#333" }}>Categories</h5>
                <ul className="list-group mb-4" style={{ borderRadius: "13px" }}>
                  <li
                    className="list-group-item d-flex align-items-center"
                    style={listItemStyle(selectedCategoryId === "ALL")}
                    onClick={() => { setSelectedCategoryId("ALL"); fetchAllNumbers(); }}
                  >
                    <span className="me-2" role="img" aria-label="all">📋</span> All Numbers
                  </li>
                  {categories.map((cat) => (
                    <li
                      key={cat.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      style={listItemStyle(cat.id === selectedCategoryId)}
                    >
                      <div style={{ cursor: "pointer", flex: 1 }} onClick={() => setSelectedCategoryId(cat.id)}>
                        {editingCategoryId === cat.id ? (
                          <input
                            className="form-control"
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                            style={inputStyle}
                          />
                        ) : (
                          cat.name
                        )}
                      </div>
                      {editingCategoryId === cat.id ? (
                        <button className="btn btn-success btn-sm" style={btnStyle} onClick={() => handleSaveCategoryEdit(cat.id)}>
                          Save
                        </button>
                      ) : (
                        <div className="d-flex gap-2">
                          <button className="btn btn-warning btn-sm" style={btnStyle} onClick={() => handleEditCategory(cat)} disabled={cat.id === "ALL"}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" style={btnStyle} onClick={() => handleDeleteCategory(cat.id)} disabled={cat.id === "ALL"}>
                            Delete
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="New category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    style={inputStyle}
                  />
                  <button className="btn btn-primary" style={btnStyle} onClick={handleAddCategory}>
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Numbers */}
          <div className="col-md-8">
            <div className="card shadow-sm border-0" style={cardStyle}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-semibold" style={{ color: "#333" }}>Numbers</h5>
                  <button className="btn btn-outline-success btn-sm" style={btnStyle} onClick={handleExportCSV}>
                    <span role="img" aria-label="download">📥</span> Export CSV
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover" style={{ borderRadius: "13px", overflow: "hidden" }}>
                    <thead>
                      <tr>
                        <th scope="col" style={tableHeadStyle}>Full Name</th>
                        <th scope="col" style={tableHeadStyle}>Phone</th>
                        <th scope="col" style={{ ...tableHeadStyle, width: "140px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {numbers.map((n) => (
                        <tr key={n.id}>
                          <td style={tableTdStyle}>
                            {editingNumberId === n.id ? (
                              <input
                                className="form-control"
                                value={editForm.fullName}
                                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                style={inputStyle}
                              />
                            ) : (
                              n.fullName
                            )}
                          </td>
                          <td style={tableTdStyle}>
                            {editingNumberId === n.id ? (
                              <input
                                className="form-control"
                                value={editForm.phoneNumber}
                                onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                style={inputStyle}
                              />
                            ) : (
                              n.phoneNumber
                            )}
                          </td>
                          <td>
                            {editingNumberId === n.id ? (
                              <button className="btn btn-success btn-sm" style={btnStyle} onClick={() => handleEditSave(n.id)}>
                                Save
                              </button>
                            ) : (
                              <div className="d-flex gap-2">
                                <button className="btn btn-warning btn-sm" style={btnStyle} onClick={() => handleEdit(n)}>
                                  Edit
                                </button>
                                <button className="btn btn-danger btn-sm" style={btnStyle} onClick={() => handleDelete(n.id)}>
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selectedCategoryId && selectedCategoryId !== "ALL" && (
                  <div className="card p-3 mt-4" style={{ background: "#f9fbfd", borderRadius: "15px" }}>
                    <h6 className="fw-semibold mb-3" style={{ color: "#333" }}>Add New Number</h6>
                    <div className="row g-3">
                      <div className="col-md-5">
                        <input
                          className="form-control"
                          placeholder="Full Name"
                          value={newNumber.fullName}
                          onChange={(e) => setNewNumber({ ...newNumber, fullName: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                      <div className="col-md-5">
                        <input
                          className="form-control"
                          placeholder="Phone Number (e.g., +2126...)"
                          value={newNumber.phoneNumber}
                          onChange={(e) => setNewNumber({ ...newNumber, phoneNumber: e.target.value })}
                          style={inputStyle}
                        />
                        {phoneWarning && <small className="text-danger mt-1 d-block">{phoneWarning}</small>}
                      </div>
                      <div className="col-md-2">
                        <button className="btn btn-primary w-100" style={btnStyle} onClick={handleAddNumber}>
                          Add
                        </button>
                      </div>
                    </div>
                    <small className="text-muted mt-2 d-block">
                      ⚠️ Phone number must start with +212 and be exactly 13 characters.
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserSidebarLayout>
  );
};

export default CategoriesAndNumbers;
