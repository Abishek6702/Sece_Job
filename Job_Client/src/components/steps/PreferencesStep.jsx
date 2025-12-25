import { X } from "lucide-react";
import React from "react";

export default function PreferencesStep({ formData, setFormData, errors }) {
  const handleRoleChange = (idx, e) => {
    const arr = [...formData.preferredRoles];
    arr[idx] = e.target.value;
    setFormData((prev) => ({ ...prev, preferredRoles: arr }));
  };

  const addRole = () =>
    setFormData((prev) => ({
      ...prev,
      preferredRoles: [...prev.preferredRoles, ""],
    }));

  const removeRole = (idx) => {
    setFormData((prev) => {
      const arr = [...prev.preferredRoles];
      arr.splice(idx, 1);
      return { ...prev, preferredRoles: arr };
    });
  };

  // const handleSalaryChange = (e) =>
  //   setFormData((prev) => ({
  //     ...prev,
  //     salaryExpectation: e.target.value,
  //   }));

  const handleSkillsChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      skills: value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      skillsInput: value,
    }));
  };

  return (
    <div>
      <h2 className="text-xl font-bold ">Preferences</h2>
      <p className="mb-6 text-gray-700">Set your job preferences</p>

      {/* Preferred Roles */}
      <div className="roles grid grid-cols-2">
        <div className="mb-6 w-[365px] md:w-[535px] lg:w-[775px]">
          <div className="font-bold mb-2">
            Current Role<span className="text-red-500">*</span>
          </div>
          <div className="max-h-[200px] overflow-y-auto pr-2 ">
            {formData.preferredRoles.map((role, idx) => (
              <div key={idx} className="relative flex items-center gap-2 mb-2">
                <input
                  placeholder="Current Role"
                  value={role}
                  onChange={(e) => handleRoleChange(idx, e)}
                  className="border  p-2 border-gray-300 rounded-md outline-none flex-1"
                />
                {formData.preferredRoles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRole(idx)}
                    className="text-red-500"
                  >
                    <X />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors?.preferredRoles && (
            <p className="text-red-500 text-sm">{errors.preferredRoles}</p>
          )}
        </div>
      </div>

      {/* Salary Expectation */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* <div className="flex flex-col gap-1">
          <label className="font-bold">Salary Expectation <span className="text-red-500">*</span></label>
          <input
            name="salaryExpectation"
            type="number"
            value={formData.salaryExpectation}
            onChange={handleSalaryChange}
            className="border p-2 border-gray-300 rounded-md outline-none"
          />
          {errors?.salaryExpectation && (
            <p className="text-red-500 text-sm">{errors.salaryExpectation}</p>
          )}
        </div> */}

        {/* Skills */}
        <div className="flex flex-col gap-1 col-span-2">
          <label className="font-bold">
            Skills (comma separated) <span className="text-red-500">*</span>
          </label>
          {/* <p className="text-gray-400">Add maximum of 5 skills</p> */}
          <textarea
            value={formData.skillsInput}
            onChange={handleSkillsChange}
            className="border  p-2 border-gray-300 rounded-md outline-none"
            placeholder="e.g. JavaScript, React, Node.js"
          />
          {errors?.skills && (
            <p className="text-red-500 text-sm">{errors.skills}</p>
          )}
        </div>
      </div>
    </div>
  );
}