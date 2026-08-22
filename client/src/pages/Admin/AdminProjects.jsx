import { useState, useEffect } from "react";
import { Modal, Input, message } from "antd";
import axios from "axios";
import { useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";

function AdminProjects() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [projects, setProjects] = useState([]);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
  const [type, setType] = useState("add");
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    imgURL: null,
    githubURL: "",
    figmaURL: "",
    websiteURL: "",
  });

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/project/get`);
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch projects");
    }
  };

  const handleAddProject = async () => {
    try {
      setLoading(true);
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("githubURL", formData.githubURL);
      payload.append("figmaURL", formData.figmaURL);
      payload.append("websiteURL", formData.websiteURL);
      if (formData.imgURL) payload.append("imgURL", formData.imgURL);

      const res = await axios.post(`${API_URL}/project/add`, payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        message.success(res.data.message);
        resetForm();
        fetchProjects();
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      message.error(err.message || "Add failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async () => {
    try {
      setLoading(true);
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("githubURL", formData.githubURL);
      payload.append("figmaURL", formData.figmaURL);
      payload.append("websiteURL", formData.websiteURL);
      if (formData.imgURL) payload.append("imgURL", formData.imgURL);

      const res = await axios.patch(
        `${API_URL}/project/update/${selectedItemForEdit._id}`,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        message.success(res.data.message);
        resetForm();
        fetchProjects();
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      message.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      message.error("Title is required");
      return;
    }

    if (type === "add" && !formData.imgURL) {
      message.error("Image is required");
      return;
    }

    if (type === "edit" && selectedItemForEdit) {
      await handleUpdateProject();
    } else {
      await handleAddProject();
    }
  };

  const resetForm = () => {
    setSelectedItemForEdit(null);
    setFormData({
      title: "",
      imgURL: null,
      githubURL: "",
      figmaURL: "",
      websiteURL: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setShowAddEditModal(false);
  };

  const onDelete = (item) => {
    Modal.confirm({
      title: "Are you sure you want to delete this project?",
      content: item.title,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const res = await axios.delete(`${API_URL}/project/${item._id}`, {
            withCredentials: true,
          });
          if (res.data.success) {
            message.success(res.data.message);
            fetchProjects();
          } else {
            message.error(res.data.message);
          }
        } catch (err) {
          message.error(err.message || "Delete failed");
        }
      },
    });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

 useEffect(() => {
   if (type === "edit" && selectedItemForEdit) {
     setFormData({
       title: selectedItemForEdit.title || "",
       imgURL: selectedItemForEdit.imgURL || null,
       githubURL: selectedItemForEdit.githubURL || "",
       figmaURL: selectedItemForEdit.figmaURL || "",
       websiteURL: selectedItemForEdit.websiteURL || "",
     });
   }
 }, [selectedItemForEdit, type]);

  return (
    <div>
      {/* Add Button */}
      <div className="flex justify-end">
        <button
          className="bg-primary px-5 py-2 text-secondary mb-5 flex items-center gap-4"
          onClick={() => {
            setSelectedItemForEdit(null);
            setType("add");
            setShowAddEditModal(true);
          }}
        >
          Add Project<i className="fa-regular fa-square-plus text-xl"></i>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-4 gap-5 sm:grid-cols-1">
        {projects.map((project) => (
          <div
            key={project._id}
            className="shadow border-2 p-5 flex flex-col gap-5 border-silver"
          >
            <h1 className="text-secondary text-xl font-bold flex justify-center">
              {project.title}
            </h1>
            <hr />
            <img
              src={project.imgURL}
              alt={project.title}
              className="h-60 w-80 object-cover mx-auto"
            />

            <div className="flex justify-end mt-5 gap-5">
              <button
                className="bg-blue-500 text-white px-4 py-2"
                onClick={() => {
                  setSelectedItemForEdit(project);
                  setType("edit");
                  setShowAddEditModal(true);
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2"
                onClick={() => onDelete(project)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {(type === "add" || selectedItemForEdit) && (
        <Modal
          open={showAddEditModal}
          title={selectedItemForEdit ? "Edit Project" : "Add Project"}
          footer={null}
          onCancel={() => resetForm()}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <Input
              placeholder="Github URL"
              value={formData.githubURL}
              onChange={(e) =>
                setFormData({ ...formData, githubURL: e.target.value })
              }
            />
            <Input
              placeholder="Figma URL"
              value={formData.figmaURL}
              onChange={(e) =>
                setFormData({ ...formData, figmaURL: e.target.value })
              }
            />
            <Input
              placeholder="Website URL"
              value={formData.websiteURL}
              onChange={(e) =>
                setFormData({ ...formData, websiteURL: e.target.value })
              }
            />
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) =>
                setFormData({ ...formData, imgURL: e.target.files[0] })
              }
            />

            <div className="flex justify-end gap-3 mt-3">
              <button
                type="button"
                className="border-primary text-primary px-5 py-2"
                onClick={() => resetForm()}
              >
                CLOSE
              </button>
              <button
                disabled={loading}
                className="bg-primary text-secondary px-5 py-2"
                type="submit"
              >
                {loading ? (
                  <LoadingOutlined />
                ) : selectedItemForEdit ? (
                  "Update"
                ) : (
                  "Add"
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default AdminProjects;
