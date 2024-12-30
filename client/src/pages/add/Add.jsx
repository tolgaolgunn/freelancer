import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Add.scss"; // Import the CSS file for styling

const Add = () => {
  const titleRef = useRef();
  const shortTitleRef = useRef();
  const descriptionRef = useRef();
  const shortDescRef = useRef();
  const priceRef = useRef();
  const categoryRef = useRef();
  const deliveryTimeRef = useRef();
  const revisionNumberRef = useRef();
  const [cover, setCover] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (gig) => {
      const formData = new FormData();
      formData.append("file", cover);
      formData.append("upload_preset", "freelancer");

      const response = await fetch("https://api.cloudinary.com/v1_1/dgjodxmkv/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      gig.cover = data.secure_url; 

      return newRequest.post("/gigs", gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      navigate("/gigs");
    },
    onError: (error) => {
      console.log("Error creating gig:", error.response ? error.response.data : error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const gig = {
      title: titleRef.current.value,
      shortTitle: shortTitleRef.current.value,
      desc: descriptionRef.current.value, 
      shortDesc: shortDescRef.current.value,
      price: priceRef.current.value,
      cat: categoryRef.current.value,
      deliveryTime: deliveryTimeRef.current.value,
      revisionNumber: revisionNumberRef.current.value,
    };

    mutation.mutate(gig);
  };

  return (
    <div className="add-container">
      <form className="add-form" onSubmit={handleSubmit}>
        <h2>Create a New Gig</h2>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input ref={titleRef} id="title" type="text" placeholder="Title" required />
        </div>
        <div className="form-group">
          <label htmlFor="shortTitle">Short Title</label>
          <input ref={shortTitleRef} id="shortTitle" type="text" placeholder="Short Title" required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input ref={descriptionRef} id="description" type="text" placeholder="Description" required />
        </div>
        <div className="form-group">
          <label htmlFor="shortDesc">Short Description</label>
          <input ref={shortDescRef} id="shortDesc" type="text" placeholder="Short Description" required />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input ref={priceRef} id="price" type="number" placeholder="Price" required />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input ref={categoryRef} id="category" type="text" placeholder="Category" required />
        </div>
        <div className="form-group">
          <label htmlFor="deliveryTime">Delivery Time</label>
          <input ref={deliveryTimeRef} id="deliveryTime" type="number" placeholder="Delivery Time (days)" required />
        </div>
        <div className="form-group">
          <label htmlFor="revisionNumber">Revision Number</label>
          <input ref={revisionNumberRef} id="revisionNumber" type="number" placeholder="Revision Number" required />
        </div>
        <div className="form-group">
          <label htmlFor="cover">Cover</label>
          <input id="cover" type="file" onChange={(e) => setCover(e.target.files[0])} required />
        </div>
        <button type="submit" className="submit-button">Create Gig</button>
      </form>
    </div>
  );
};

export default Add;