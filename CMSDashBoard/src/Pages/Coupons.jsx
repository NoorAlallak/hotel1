import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "../Context/LanguageContext";
import ExportButton from "../Components/ExportButton";
const Coupons = () => {
  const { t } = useLanguage();
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    type: "Percentage",
    validFrom: "",
    validTo: "",
    maxUses: "",
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("http://localhost:3000/coupons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(res.data);
    } catch (err) {
      console.error("Error fetching coupons:", err.response?.data || err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        discount: Number(formData.discount),
        maxUses: Number(formData.maxUses),
      };
      const res = await axios.post("http://localhost:3000/coupons", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons([res.data, ...coupons]);
      setShowForm(false);
      setFormData({
        code: "",
        discount: "",
        type: "Percentage",
        validFrom: "",
        validTo: "",
        maxUses: "",
      });
    } catch (err) {
      console.error("Error creating coupon:", err.response?.data || err);
      alert(err.response?.data?.error || "Failed to create coupon");
    }
  };

  const toggleCouponStatus = async (coupon) => {
    try {
      const newStatus = coupon.status === "Active" ? "Inactive" : "Active";
      const res = await axios.patch(
        `http://localhost:3000/coupons/${coupon.id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? res.data : c))
      );
    } catch (err) {
      console.error("Error toggling status:", err.response?.data || err);
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await axios.delete(`http://localhost:3000/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting coupon:", err.response?.data || err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t("Coupons")}</h2>
        <div className="flex space-x-2 items-center ">
          <ExportButton data={coupons} filename="coupons.csv" />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? t("Cancel") : t("Add Coupon")}
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-lg shadow space-y-3"
        >
          <input
            type="text"
            placeholder="Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
            className="border p-2 w-full rounded"
          />
          <input
            type="number"
            placeholder="Discount"
            value={formData.discount}
            onChange={(e) =>
              setFormData({ ...formData, discount: e.target.value })
            }
            required
            className="border p-2 w-full rounded"
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="border p-2 w-full rounded"
          >
            <option>Percentage</option>
            <option>Fixed</option>
          </select>
          <input
            type="date"
            value={formData.validFrom}
            onChange={(e) =>
              setFormData({ ...formData, validFrom: e.target.value })
            }
            required
            className="border p-2 w-full rounded"
          />
          <input
            type="date"
            value={formData.validTo}
            onChange={(e) =>
              setFormData({ ...formData, validTo: e.target.value })
            }
            required
            className="border p-2 w-full rounded"
          />
          <input
            type="number"
            placeholder="Max Uses"
            value={formData.maxUses}
            onChange={(e) =>
              setFormData({ ...formData, maxUses: e.target.value })
            }
            className="border p-2 w-full rounded"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            {t("Save")}
          </button>
        </form>
      )}

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valid From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valid To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map((c) => (
              <tr key={c.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.discount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.validFrom?.slice(0, 10)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.validTo?.slice(0, 10)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {c.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => toggleCouponStatus(c)}
                  >
                    Toggle
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => deleteCoupon(c.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coupons;
