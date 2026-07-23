import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Button, message } from "antd";
import {
  EyeTwoTone,
  EyeInvisibleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

function ResetPassword() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useParams();

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/admin/dashboard");
    }
  }, [navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/admin/reset-password/${token}`,
        { password },
        {
          withCredentials: true,
        }
      );
      message.success(res?.data.message || "Password Chaged");
      navigate("/admin/login");
    } catch (error) {
      console.log(error);

      message.error(error?.response?.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box flex justify-center items-center h-screen bg-primary">
      <form
        onSubmit={handleSubmit}
        className="w-96 flex gap-4 flex-col shadow-lg border border-secondary p-6 bg-primary rounded"
      >
        <h1 className="flex justify-center text-xl font-semibold text-tubeLight-effect py-2">
          Reset Password
        </h1>

        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="placeholder-gray-500 pr-10"
          />
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer text-secondary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
          </div>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          className="bg-secondary text-white font-semibold"
        >
          {loading ? <LoadingOutlined /> : "Change"}
        </Button>
      </form>
    </div>
  );
}

export default ResetPassword;
