import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

function ForgotPassword() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
        `${API_URL}/admin/forgot-password`,
        { email },
        {
          withCredentials: true,
        }
      );
      message.success(res?.data.message || "Reset link sent to your email");
      navigate("/");
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
          Forgot Password ?
        </h1>
        <p className="text-gray-500 mb-6 mt-2 text-center text-sm">
          Enter your registered email address and we&apos;ll send you a link to
          reset your password.
        </p>
        <Input
          name="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="placeholder-gray-500"
        />
        <div className="flex flex-col mt-2 gap-2">
          <Button
            type="primary"
            className="bg-secondary text-white font-semibold"
            htmlType="submit"
          >
            {loading ? <LoadingOutlined /> : "Send Reset Link"}
          </Button>
          <Button
            disabled={loading}
            className={`font-semibold ${loading ? "text-white" : ""}`}
            onClick={() => navigate("/admin/login")}
          >
            I remebered it
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
