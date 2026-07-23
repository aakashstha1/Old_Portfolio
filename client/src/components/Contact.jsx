import SectionTitle from "./SectionTitle";
import { Button, Input, message } from "antd";
import Lottie from "lottie-react";
import contact from "../assets/lottie/contact.json";
import { useState } from "react";
import axios from "axios";
// import { MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";

const { TextArea } = Input;

function Contact() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!inputs.name || !inputs.email || !inputs.message) {
      message.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/sendMsg`, inputs);
      message.success("Message sent successfully!");
      setInputs({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Submission failed:", error);
      message.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact">
      <SectionTitle title="Contact" />
      <div className="flex items-center w-full gap-6">
        {/* Lottie Animation */}
        <div className="w-full md:w-1/2 flex justify-center sm:hidden">
          <Lottie
            animationData={contact}
            loop={true}
            style={{ width: 400, height: 400 }}
          />
        </div>

        {/* Contact Form */}
        <div className="w-full  flex justify-center">
          <div className="w-full space-y-4">
            <Input
              type="text"
              name="name"
              placeholder="Your Name"
              value={inputs.name}
              onChange={handleChange}
              className="placeholder-gray-500"
              required
            />

            <Input
              type="email"
              name="email"
              placeholder="Your Email"
              value={inputs.email}
              onChange={handleChange}
              className="placeholder-gray-500"
              required
            />

            <Input
              type="number"
              name="phone"
              placeholder="Phone Number"
              value={inputs.phone}
              onChange={handleChange}
              className="placeholder-gray-500"
            />

            <TextArea
              name="message"
              placeholder="Your Message"
              value={inputs.message}
              onChange={handleChange}
              rows={4}
              className="placeholder-gray-500"
              required
            />

            <div className="flex justify-end">
              <Button
                className="w-full "
                type="primary"
                loading={loading}
                onClick={handleSubmit}
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
