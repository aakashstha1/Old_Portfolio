import { useState, useEffect } from "react";
import { Tabs, Dropdown } from "antd";
import AdminIntro from "./AdminIntro";
import AdminAbout from "./AdminAbout";
import AdminExperiences from "./AdminExperiences";
import AdminProjects from "./AdminProjects";
// import AdminContact from "./AdminContact";
import Links from "./Links";
import { SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ChangePassword from "../Auth/ChangePassword";
import AdminAchivement from "./AdminAchivement";
import { useAuth } from "../../hooks/useAuth";

function Dashboard() {
  const [activeTabKey, setActiveTabKey] = useState("1");
  const { user, logout } = useAuth();
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const savedTabKey = localStorage.getItem("activeTabKey");
    if (savedTabKey) {
      setActiveTabKey(savedTabKey);
    }
  }, []);

  // Save the active tab key when it changes
  const onChange = (key) => {
    setActiveTabKey(key);
    localStorage.setItem("activeTabKey", key);
  };

  const handelLogout = async () => {
    const res = await logout();
    if (res.success) {
      navigate("/admin/login");
    } else {
      console.error("Logout failed:", res.error);
    }
  };

  const items = [
    {
      key: "1",
      label: "Intro",
      children: <AdminIntro />,
    },
    {
      key: "2",
      label: "About",
      children: <AdminAbout />,
    },
    {
      key: "3",
      label: "Experience",
      children: <AdminExperiences />,
    },
    {
      key: "4",
      label: "Project",
      children: <AdminProjects />,
    },
    {
      key: "5",
      label: "Achievement",
      children: <AdminAchivement />,
    },
    {
      key: "6",
      label: "Links",
      children: <Links />,
    },
  ];

  // const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      handelLogout();
    } else if (key === "changePassword") {
      setChangePasswordVisible(true);
    }
  };

  const dropdownItems = [
    { key: "changePassword", label: "Change Password" },
    { key: "logout", label: "Logout" },
  ];

  return (
    <>
      <div className="bg-primary p-1">
        <h1 className="text-tubeLight-effect text-3xl sm:text-xl mt-5 justify-center tracking-[8px] text-center relative">
          Admin Dashboard
        </h1>
      </div>

      <Dropdown
        menu={{ items: dropdownItems, onClick: handleMenuClick }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <div className="absolute top-8 right-10 cursor-pointer sm:right-5 sm:top-7">
          <SettingOutlined className="text-white" />
        </div>
      </Dropdown>
      {user && (
        <div className="p-5">
          <Tabs activeKey={activeTabKey} items={items} onChange={onChange} />
        </div>
      )}
      <ChangePassword
        open={changePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
      />
    </>
  );
}

export default Dashboard;
