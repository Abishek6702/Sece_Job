import React from "react";

export default function ProgressBar({ steps, currentStep, onStepClick }) {
  return (
    <div className="flex items-center mb-8">
      {steps.map((label, idx) => (
        <React.Fragment key={label}>
          <div
            onClick={() => onStepClick(idx)}
            className={`flex flex-col items-center cursor-pointer ${idx < currentStep ? 'text-blue-600' : idx === currentStep ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center border-2 ${idx <= currentStep ? 'border-blue-600' : 'border-gray-300'}`}
            >
              {idx < currentStep ? "✓" : idx + 1}
            </div>
            <span className="text-xs mt-1">{label}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-2 ${idx < currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
