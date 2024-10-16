import React, { useRef, useState } from "react";
import { checkContact } from '../validData';
import './Contact.css'; // Ensure this CSS file contains your form styles

const Contact = () => {
  const name = useRef();
  const email = useRef();
  const phoneNo = useRef();
  const contactMessage = useRef();
  const [nameErrorMsg, setNameErrorMsg] = useState();
  const [emailErrorMsg, setEmailErrorMsg] = useState();
  const [phoneNoErrorMsg, setPhoneNoErrorMsg] = useState();

  const handleSubmit = async () => {
    const message = checkContact(
      name.current.value,
      email.current.value,
      phoneNo.current.value
    );

    setNameErrorMsg(message.nameMsg);
    setEmailErrorMsg(message.emailMsg);
    setPhoneNoErrorMsg(message.phoneNoMsg);

    if (
      message.nameMsg !== "" ||
      message.emailMsg !== "" ||
      message.phoneNoMsg !== ""
    ) {
      return;
    }

    // Handle form submission
  };

  return (
    <div className="contact-page container-fluid my-5">
      <div className="contact-details text-center mb-5">
        <h2>Contact Us</h2>
        <p><strong>Name:</strong> Kunj Patel</p>
        <p><strong>Address:</strong>Bopal, Ahmedabad-380058</p>
        <p><strong>Email:</strong> kp250440@gmail.com</p>
        <p><strong>Phone:</strong> +91 23456-78900</p>
      </div>

      <div className="description text-center mb-5">
        <h3>How We Manage Our Customers</h3>
        <p>
          We pride ourselves on our customer service and support. Our dedicated team ensures that each customer is treated with the utmost care and attention, providing timely responses to inquiries and resolving any issues efficiently.
        </p>
      </div>

      <div className="contact-form">
        <h3 className="text-center mb-4">Let us know</h3>
        <form
          className=" max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="form-group mb-3">
            <label htmlFor="name" className="form-label">Your Name</label>
            <input
              id="name"
              className="form-control"
              type="text"
              placeholder="Enter Full Name"
              ref={name}
            />
            {nameErrorMsg && <div className="error-message">{nameErrorMsg}</div>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="emailID" className="form-label">Email</label>
            <input
              id="emailID"
              className="form-control"
              type="email"
              placeholder="Enter Email"
              ref={email}
            />
            {emailErrorMsg && <div className="error-message">{emailErrorMsg}</div>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="phoneNo" className="form-label">Phone No.</label>
            <input
              id="phoneNo"
              className="form-control"
              type="text"
              placeholder="Enter Phone Number"
              ref={phoneNo}
            />
            {phoneNoErrorMsg && <div className="error-message">{phoneNoErrorMsg}</div>}
          </div>

          <div className="form-group mb-4">
            <label htmlFor="message" className="form-label">Enter Message</label>
            <textarea
              ref={contactMessage}
              id="message"
              placeholder="Enter Message"
              className="form-control"
              rows="4"
            ></textarea>
          </div>

          <button
            className="btn btn-primary w-100"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
