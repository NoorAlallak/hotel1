import React, { useState } from "react";
function ContactUsComponent() {
  const [showPopup, setShowPopup] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ebf5f4] my-8">
      <h1 className="text-4xl font-bold mb-6 text-[#509697]">Contact Us</h1>
      <p className="text-lg mb-4 text-center max-w-xl">
        If you have any questions, feedback, or need assistance, please feel
        free to reach out to us. We're here to help!
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-[#509697]">
          Get in Touch
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#509697] focus:border-[#509697]"
              id="name"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#509697] focus:border-[#509697]"
              placeholder="
Your Email"
              id="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#509697] focus:border-[#509697]"
              rows="4"
              placeholder="Your Message"
              id="message"
            ></textarea>
          </div>
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full bg-[#509697] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#3b7d7d] transition"
          >
            Send Message
          </button>
        </form>
      </div>
      {showPopup && (
        <div className="fixed  flex items-center justify-center inset-0 bg-white bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-[#509697] text-center">
              Thank You!
            </h2>
            <p className="text-lg">
              Your message has been sent. We will get back to you shortly.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-[#509697] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#3b7d7d] transition cursor-pointer w-full text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactUsComponent;
