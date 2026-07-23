import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "antd";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/admin/dashboard");
    }
  }, [navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(inputs);
    if (res.success) {
      navigate("/admin/dashboard");
    } else {
      console.error("Login failed:", res.error);
    }
  };

  return (
    <div className="box flex justify-center items-center h-screen bg-primary">
      <form
        onSubmit={handleSubmit}
        className="w-96 flex gap-4 flex-col shadow-lg border border-secondary p-6 bg-primary rounded"
      >
        <h1 className="flex justify-center text-xl font-semibold text-tubeLight-effect py-2">
          Admin Login
        </h1>

        <Input
          name="username"
          placeholder="Username"
          value={inputs.username}
          onChange={handleChange}
          required
          className="placeholder-gray-500"
        />

        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={inputs.password}
            onChange={handleChange}
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

        <div className="flex justify-end text-sm text-secondary underline cursor-pointer">
          <span onClick={() => navigate("/admin/forgot-password")}>
            Forgot Password?
          </span>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          className="bg-secondary text-white font-semibold"
        >
          Login
        </Button>
      </form>
    </div>
  );
}

export default Login;
