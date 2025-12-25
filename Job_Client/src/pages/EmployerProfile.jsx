import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link as ScrollLink, Element } from "react-scroll";
import { MoveUpRight, Play } from "lucide-react";
import edit_icon from "../assets/edit.svg";
import close_icon from "../assets/close.svg";
import delete_icon from "../assets/delete.svg";
import DeleteConfirmation from "../components/DeleteConfirmation";
import { useNavigate } from "react-router-dom";
import CompanyUpdateForm from "../components/CompanyUpdateForm";
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.userId || decoded._id || decoded.id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const EmployerProfile = () => {
  const navigate = useNavigate();

  const [showAllImages, setShowAllImages] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [companyIdToEdit, setCompanyIdToEdit] = useState(null); // new state
  const [companyToEdit, setCompanyToEdit] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken();

      if (!userId || !token) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/companies`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const allCompanies = response.data || [];
        const userCompanies = allCompanies.filter(
          (company) => company.createdBy === userId
        );
        setCompanies(userCompanies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const company = companies[0];
  const visibleImages = showAllImages
    ? company?.images
    : company?.images?.slice(0, 3);
  const imageCount = visibleImages?.length || 0;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDeleteClick = (companyId) => {
    setCompanyToDelete(companyId);
    setShowDeleteModal(true);
  };
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };
  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/companies/${companyToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowDeleteModal(false);
      console.log("Job deleted!");

      // 👇 Navigate to employer dashboard
      alert("Company and its associated jobs deleted sucessfully");
      localStorage.removeItem("token");
      navigate("/");
      window.location.reload(); // 🔥 Forces full page reload (last resort)
    } catch (error) {
      console.error("Delete failed", error);
      // Optionally show error feedback
    }
  };
  const handleEditClick = (company) => {
    setCompanyToEdit(company);
    setCompanyIdToEdit(company._id); // set company ID
  };

  const handleCancelEdit = () => {
    setCompanyIdToEdit(null); // Clear the company ID to exit edit mode
    setCompanyToEdit(null);
  };

  return (
    <div className="main_container">
      {companyIdToEdit ? (
        <CompanyUpdateForm
          company={companyToEdit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <div className="w-[100%] md:w-[90%] m-auto mt-4 border border-gray-300 rounded-md bg-white shadow-sm">
          <div className="m-4 p-4 mb-2 ">
            <div className=" md:flex justify-between items-center">
              <div className="relative w-fit border rounded-full overflow-hidden ">
                <img
                  src={
                    company?.company_logo
                      ? `${
                          company.company_logo.replace(/\\/g, "/")}`
                      : "https://via.placeholder.com/150"
                  }
                  alt="Company Logo"
                  className="w-20 h-20 object-cover rounded-full"
                />
              </div>
              <div className=" flex gap-4 mt-4 md:mt-0 ">
                <div className="">
                  <button
                    className="bg-blue-600  text-white font-bold py-2 px-4 rounded-xl cursor-pointer flex gap-2 items-center"
                    onClick={() => handleEditClick(company)}
                  >
                    <img src={edit_icon} className="w-4 h-4" />
                    <p className="hidden md:block"> Edit</p>
                  </button>
                </div>
                <div className="">
                  <button
                    className="bg-[#F94144] text-white font-bold py-2 px-4 rounded-xl cursor-pointer flex gap-2 items-center"
                    onClick={() => {
                      handleDeleteClick(company._id);
                    }}
                  >
                    <img src={delete_icon} className="w-4 h-4" />
                    <p className="hidden md:block">Delete</p>
                  </button>
                  {showDeleteModal && (
                    <DeleteConfirmation
                      onConfirm={handleConfirmDelete}
                      onCancel={handleCancelDelete}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="user_details mt-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <p className="font-semibold text-2xl text-gray-800">
                  {company?.company_name || "Company Name"}
                </p>
              </div>
              <p className="text-gray-600 mt-2">
                {company?.company_type || "Industry"}
              </p>
              <p className="text-gray-500 mt-1">
                {company?.location || "Location"}
              </p>
              <div className="flex justify-between items-center">
                <div className="underline flex items-center gap-1 text-blue-600">
                  <a
                    href={company?.site_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" py-2  text-blue-600 rounded-lg font-bold  "
                  >
                    {company?.site_url ? "Visit Site" : "Apply"}
                  </a>
                  <MoveUpRight className="w-4 h-4 " />
                </div>
              </div>
            </div>
          </div>

          <div className="sticky top-0 z-10 bg-white w-full border-b border-gray-200">
            <div className="flex px-6 py-2 gap-6 font-semibold text-gray-500 text-md">
              <ScrollLink
                to="about-section"
                smooth={true}
                duration={500}
                offset={-100}
                spy={true}
                activeClass="text-blue-600 border-b-2 border-blue-600"
                className="cursor-pointer px-1"
              >
                <span>About</span>
              </ScrollLink>
              <ScrollLink
                to="Gallery"
                smooth={true}
                duration={500}
                offset={-100}
                spy={true}
                activeClass="text-blue-600 border-b-2 border-blue-600"
                className="cursor-pointer px-1"
              >
                <span>Gallery</span>
              </ScrollLink>
            </div>
          </div>

          <Element name="about-section" className="pt-6 px-4">
            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 max-w-5xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">
                About the Company
              </h2>
              <p className="text-gray-700 text-base leading-relaxed">
                {company?.about?.content || "Company description goes here..."}
              </p>
              <p className="text-blue-600 font-medium">
                {company?.employee_count || 0} Employees
              </p>
              <div className="grid sm:grid-cols-2 gap-6  text-gray-600">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                    Stock Value
                  </span>
                  <span className="text-xl font-medium text-black">
                    {company?.about?.stock_value || "N/A"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                    Contact Info
                  </span>
                  <span className="text-xl font-medium text-black truncate  w-[80%]">
                    {company?.about?.contact_info || "Not provided"}
                  </span>
                </div>
              </div>
            </div>
          </Element>

          <Element name="Gallery" className="pt-6">
            <div
              className={`grid gap-4 px-4 ${
                imageCount >= 4
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-3 place-items-center"
              }`}
            >
              {visibleImages?.map((imgPath, index) => {
                const normalizedPath = imgPath.replace(/\\/g, "/");
                const fullImageUrl = `${normalizedPath}`;
                return (
                  <div
                    key={index}
                    className="w-full max-w-[280px] aspect-square overflow-hidden rounded-xl shadow-md"
                  >
                    <img
                      src={fullImageUrl}
                      alt={`Company gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>

            {company?.images?.length > 3 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowAllImages(!showAllImages)}
                  className="flex items-center gap-2 px-6 py-2 rounded-full shadow-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all"
                >
                  <p className="font-medium">
                    {showAllImages
                      ? "Show Less"
                      : `Show ${company.images.length - 3} More`}
                  </p>
                  <Play
                    className={`w-4 h-4 transition-transform ${
                      showAllImages ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            )}
          </Element>
        </div>
      )}
    </div>
  );
};

export default EmployerProfile;
