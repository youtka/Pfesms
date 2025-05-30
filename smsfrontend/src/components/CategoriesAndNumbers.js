import React, { useEffect, useState } from "react";
import axios from "axios";
import UserSidebarLayout from "./UserSidebarLayout";

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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId && selectedCategoryId !== "ALL") {
      fetchNumbers(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const fetchCategories = () => {
    axios
      .get("http://localhost:9190/api/category/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCategories(res.data);
        if (res.data.length > 0) setSelectedCategoryId(res.data[0].id);
      })
      .catch((err) => console.error("❌ Failed to fetch categories", err));
  };

  const fetchNumbers = (categoryId) => {
    axios
      .get(`http://localhost:9190/api/number/by-category/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNumbers(res.data))
      .catch((err) => console.error("❌ Failed to fetch numbers", err));
  };

  const fetchAllNumbers = () => {
    axios
      .get("http://localhost:9190/api/number/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNumbers(res.data))
      .catch(() => alert("❌ Failed to fetch all numbers"));
  };

  const isValidMoroccanNumber = (num) => {
    return /^\+212[5-9]\d{8}$/.test(num); // accepts +2126, +2127, +2128, +2129
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    axios
      .post(
        "http://localhost:9190/api/category/create",
        { name: newCategoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setNewCategoryName("");
        fetchCategories();
      })
      .catch(() => alert("❌ Failed to add category"));
  };

  const handleDeleteCategory = (id) => {
    if (!window.confirm("Are you sure?")) return;
    axios
      .delete(`http://localhost:9190/api/category/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        if (id === selectedCategoryId) setSelectedCategoryId(null);
        fetchCategories();
      })
      .catch(() => alert("❌ Failed to delete category"));
  };

  const handleEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setEditCategoryName(cat.name);
  };

  const handleSaveCategoryEdit = (id) => {
    axios
      .put(
        `http://localhost:9190/api/category/update/${id}`,
        { name: editCategoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      )
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
      .post(
        "http://localhost:9190/api/number/add",
        {
          ...newNumber,
          categoryId: selectedCategoryId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setNewNumber({ fullName: "", phoneNumber: "" });
        fetchNumbers(selectedCategoryId);
      })
      .catch(() => alert("❌ Failed to add number"));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure?")) return;
    axios
      .delete(`http://localhost:9190/api/number/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchNumbers(selectedCategoryId);
      })
      .catch(() => alert("❌ Failed to delete"));
  };

  const handleEdit = (n) => {
    setEditingNumberId(n.id);
    setEditForm({ fullName: n.fullName, phoneNumber: n.phoneNumber });
  };

  const handleEditSave = (id) => {
    axios
      .put(
        `http://localhost:9190/api/number/update/${id}`,
        {
          ...editForm,
          categoryId: selectedCategoryId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setEditingNumberId(null);
        fetchNumbers(selectedCategoryId);
      })
      .catch(() => alert("❌ Failed to update"));
  };

  const handleExportCSV = () => {
    if (!numbers.length) return alert("No numbers to export");

    const csvContent =
      "Full Name,Phone Number\n" +
      numbers.map((n) => `${n.fullName},${n.phoneNumber}`).join("\n");

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
      <div className="container mt-4">
        <h3 className="mb-4">📂 Categories & Numbers</h3>

        <div className="row">
          {/* Categories */}
          <div className="col-md-4">
            <h5>Categories</h5>
            <ul className="list-group mb-3">
              <li
                className={`list-group-item ${selectedCategoryId === "ALL" ? "active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedCategoryId("ALL");
                  fetchAllNumbers();
                }}
              >
                📋 All Numbers
              </li>
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className={`list-group-item d-flex justify-content-between align-items-center ${cat.id === selectedCategoryId ? "active" : ""}`}
                >
                  <div onClick={() => setSelectedCategoryId(cat.id)} style={{ cursor: "pointer", flex: 1 }}>
                    {editingCategoryId === cat.id ? (
                      <input
                        className="form-control"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                      />
                    ) : (
                      cat.name
                    )}
                  </div>
                  {editingCategoryId === cat.id ? (
                    <button className="btn btn-sm btn-success ms-2" onClick={() => handleSaveCategoryEdit(cat.id)}>Save</button>
                  ) : (
                    <>
                      <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEditCategory(cat)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
                    </>
                  )}
                </li>
              ))}
            </ul>

            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="New category"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleAddCategory}>Add</button>
            </div>
          </div>

          {/* Numbers */}
          <div className="col-md-8">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5>Numbers</h5>
              <button className="btn btn-outline-success btn-sm" onClick={handleExportCSV}>
                Export CSV
              </button>
            </div>

            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th style={{ width: "140px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {numbers.map((n) => (
                  <tr key={n.id}>
                    <td>
                      {editingNumberId === n.id ? (
                        <input
                          className="form-control"
                          value={editForm.fullName}
                          onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                        />
                      ) : (
                        n.fullName
                      )}
                    </td>
                    <td>
                      {editingNumberId === n.id ? (
                        <input
                          className="form-control"
                          value={editForm.phoneNumber}
                          onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                        />
                      ) : (
                        n.phoneNumber
                      )}
                    </td>
                    <td>
                      {editingNumberId === n.id ? (
                        <button className="btn btn-success btn-sm" onClick={() => handleEditSave(n.id)}>Save</button>
                      ) : (
                        <>
                          <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(n)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n.id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Only show add form if a real category is selected */}
            {selectedCategoryId && selectedCategoryId !== "ALL" && (
              <div className="card p-3">
                <h6>Add New Number</h6>
                <div className="row g-2">
                  <div className="col-md-5">
                    <input
                      className="form-control"
                      placeholder="Full Name"
                      value={newNumber.fullName}
                      onChange={(e) => setNewNumber({ ...newNumber, fullName: e.target.value })}
                    />
                  </div>
                  <div className="col-md-5">
                    <input
                      className="form-control"
                      placeholder="Phone Number"
                      value={newNumber.phoneNumber}
                      onChange={(e) => setNewNumber({ ...newNumber, phoneNumber: e.target.value })}
                    />
                    {phoneWarning && <small className="text-danger">{phoneWarning}</small>}
                  </div>
                  <div className="col-md-2">
                    <button className="btn btn-primary w-100" onClick={handleAddNumber}>Add</button>
                  </div>
                </div>
                <small className="text-muted mt-1 d-block">
                  ⚠️ Phone number must start with +212 and be exactly 13 characters.
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserSidebarLayout>
  );
};

export default CategoriesAndNumbers;
