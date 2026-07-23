import { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoadingOutlined,
} from "@ant-design/icons";
import axios from "axios";

// eslint-disable-next-line react/prop-types
function ChangePassword({ open, onClose }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [inputs, setInputs] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.put(`${API_URL}/admin/update`, inputs, {
        withCredentials: true,
      });
      message.success(res.data.message);
      handleClose();
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInputs({ oldPassword: "", newPassword: "" });

    onClose();
  };

  return (
    <Modal
      open={open}
      title="Change Password"
      onCancel={handleClose}
      footer={null}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="relative">
            <Input
              name="oldPassword"
              type={showOld ? "text" : "password"}
              placeholder="Enter Old Password"
              value={inputs.oldPassword}
              onChange={handleChange}
              required
              className="placeholder-gray-500 pr-10"
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer text-secondary"
              onClick={() => setShowOld(!showOld)}
            >
              {showOld ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            </div>
          </div>
          <div className="relative">
            <Input
              name="newPassword"
              type={showNew ? "text" : "password"}
              placeholder="Enter New Password"
              value={inputs.newPassword}
              onChange={handleChange}
              required
              className="placeholder-gray-500 pr-10"
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer text-secondary"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={handleClose}>Close</Button>
          <Button type="primary" disabled={loading} onClick={handleSubmit}>
            {loading ? <LoadingOutlined /> : "Change"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ChangePassword;
