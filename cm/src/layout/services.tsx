import React, { useState } from "react";

// Dummy data for services
const servicesData = [
  {
    id: 1,
    name: "Website Development",
    description: "Develop high-quality websites tailored to your needs.",
    available: "Monday - Friday",
    price: "$2000",
    staff: "John Doe, Jane Smith",
  },
  {
    id: 2,
    name: "SEO Optimization",
    description: "Improve the search engine ranking of your website.",
    available: "Monday - Friday",
    price: "$1500",
    staff: "Sara Lee",
  },
  {
    id: 3,
    name: "Mobile App Development",
    description: "Build native mobile apps for iOS and Android.",
    available: "Monday - Friday",
    price: "$3000",
    staff: "Tom Clark",
  },
];

// Define ServiceCatalog component using const
export const Services = () => {
  const [services] = useState(servicesData);

  return (
    <div className="service-catalog">
      <h1 className="text-center text-3xl font-bold my-4">VoxDigify Service Catalog</h1>
      <div className="service-list">
        {services.map((service) => (
          <div key={service.id} className="service-item border p-4 mb-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{service.name}</h2>
            <p className="text-gray-700">{service.description}</p>
            <div className="service-info mt-4">
              <p><strong>Availability:</strong> {service.available}</p>
              <p><strong>Price:</strong> {service.price}</p>
              <p><strong>Assigned Staff:</strong> {service.staff}</p>
            </div>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
