import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({ 
  title = "gofilez", 
  description = "Upload, store, and manage your files securely with our free cloud storage service. Access your content anytime, anywhere.", 
  keywords = "free cloud storage, file upload, secure storage, online file management, cloud drive" 
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
  </Helmet>
);

export default SEO;
