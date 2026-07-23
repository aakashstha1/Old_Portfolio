import { Input, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

const { TextArea } = Input;

function AdminAbout() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    description1: "",
    description2: "",
    skills: "",
    resume: null,
  });

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(`${API_URL}/get-about`, {
          withCredentials: true,
        });

        const data = res.data.data;
        setFormData({
          description1: data.description1 || "",
          description2: data.description2 || "",
          skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
          resume: null,
        });
      } catch (error) {
        console.error(error);
        message.error("Failed to load about data");
      }
    };

    fetchAbout();
  }, [API_URL]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, resume: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = new FormData();
      payload.append("description1", formData.description1);
      payload.append("description2", formData.description2);
      formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
        .forEach((skill) => payload.append("skills[]", skill));
      if (formData.resume) payload.append("resume", formData.resume);

      const res = await axios.put(`${API_URL}/update-about`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success(res.data.message);
      setFormData((prev) => ({ ...prev, resume: null }));
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label>
          Description 1 <span className="text-gray-400">(max 500 chars)</span>
        </label>
        <TextArea
          name="description1"
          maxLength={500}
          placeholder="Description 1"
          value={formData.description1}
          onChange={handleChange}
          required
          rows={3}
        />
      </div>

      <div>
        <label>
          Description 2 <span className="text-gray-400">(max 500 chars)</span>
        </label>
        <TextArea
          name="description2"
          maxLength={500}
          placeholder="Description 2"
          value={formData.description2}
          onChange={handleChange}
          required
          rows={3}
        />
      </div>

      <div>
        <label>
          Skills <span className="text-gray-400">(comma separated)</span>
        </label>
        <TextArea
          name="skills"
          placeholder="e.g., React, Node.js, MongoDB"
          value={formData.skills}
          onChange={handleChange}
          required
          rows={2}
        />
      </div>
      <div className="w-1/5 sm:w-full">
        <label>Resume</label>
        <Input
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
          // onChange={(e) =>
          //   setFormData({ ...formData, resume: e.target.files[0] })
          // }
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-10 py-2 bg-primary text-white rounded"
          disabled={loading}
        >
          {loading ? <LoadingOutlined /> : "SAVE"}
        </button>
      </div>
    </form>
  );
}

export default AdminAbout;
