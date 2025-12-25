import React from "react";

const CompanyListing = ({ company_props, setCompanyDetails, activeCompany  }) => {
  const formatEmployeeCount = (count) => {
    if (count >= 1_000_000) {
      return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (count >= 1_000) {
      return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return count.toString();
  };

  return (
    <>
      <div className="main_conatiner col-span-12 md:col-span-4 w-full  mt-4 ">
        <div className="card-container cursor-pointer">
          {company_props.map((item, index) => {
              const isActive = activeCompany && item._id === activeCompany._id;
            return (
              <div
               key={item._id}
                onClick={() => setCompanyDetails(item)}
                 className={`rounded-lg p-4 border m-auto mb-4 ${
                isActive
                  ? "border-blue-300 bg-gray-50 " 
                  : "border-gray-300"
              }`}
            >
                <div className="flex  justify-between">
                  <div className="flex gap-4 items-center">
                    <img
                      src={`${item.company_logo}`}
                      alt={item.company_name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-300"
                    />
                    <h2 className="font-bold text-lg">{item.company_name}</h2>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.30054 0.996875L9.91889 4.26104C10.0406 4.50687 10.2756 4.67689 10.5481 4.71605L14.2838 5.25601C14.9688 5.35518 15.2422 6.19519 14.7464 6.67686L12.0456 9.29771C11.8481 9.48937 11.758 9.76519 11.8047 10.036L12.4221 13.6227C12.5471 14.3502 11.783 14.9052 11.128 14.5627L7.88805 12.8669C7.64471 12.7394 7.35469 12.7394 7.11219 12.8669L3.87468 14.561C3.21885 14.9044 2.45216 14.3485 2.57799 13.6194L3.19556 10.036C3.24223 9.76519 3.15218 9.48937 2.95468 9.29771L0.253871 6.67686C-0.242795 6.19519 0.0304811 5.35518 0.716314 5.25601L4.45217 4.71605C4.72384 4.67689 4.95885 4.50687 5.08135 4.26104L6.69969 0.996875C7.02553 0.334375 7.97221 0.334375 8.30054 0.996875Z"
                        fill="#F8C433"
                      />
                    </svg>
                    <span className="font-semibold text-sm">
                      {item.ratings || "3.4"}
                    </span>
                  </div>
                </div>

                <div className=" flex items-center justify-between  ">
                  <div className=" justify-between items-center mt-2">
                    <p className="text-sm text-gray-400 ">{item.location}</p>
                    <p className="text-sm text-gray-400">
                      {formatEmployeeCount(item.employee_count)} Employees
                    </p>
                  </div>
                  <span className="px-4 py-1 border  text-blue-600 rounded-2xl text-sm font-semibold">
                    {(item.jobs?.length || 0) + " Jobs"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CompanyListing;
