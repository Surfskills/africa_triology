"use client";

import React, { useState, useCallback, ChangeEvent, DragEvent, FormEvent } from "react";

// Type definitions
interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  countryOfResidence: string;
  addressLine1: string;
  passportPhoto: File | null;
  cvResume: File | null;
  linkedinProfile: string;
  subjectsQualifications: string[];
  otherDisciplines: string;
  accountNumber: string;
  bankName: string;
  accountType: string;
  taxIdNumber: string;
}

interface FormErrors {
  [key: string]: string | null;
}

interface Step {
  id: number;
  title: string;
  icon: React.ComponentType;
}

interface FileUploadProps {
  accept: string;
  value: File | null;
  onChange: (file: File | null) => void;
  label: string;
  hint: string;
  error?: string | null;
}

interface DynamicListProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}

interface IconProps {
  className?: string;
}

// Icons as simple SVG components
const ChevronRight: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ChevronLeft: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const Upload: React.FC = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const X: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Check: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const User: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Briefcase: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const GraduationCap: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
);

const CreditCard: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const Plus: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const Trash2: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const Loader2: React.FC = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const countries: string[] = [
  "Kenya", "Nigeria", "South Africa", "Ghana", "Uganda", "Tanzania", "Ethiopia", "Rwanda", "Egypt", "Morocco",
  "United States", "United Kingdom", "Canada", "Germany", "France", "India", "Philippines", "Brazil", "Mexico", "Other",
];

// File Upload Component
const FileUpload: React.FC<FileUploadProps> = ({ accept, value, onChange, label, hint, error }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onChange(file);
  }, [onChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  const inputId = `file-${label.replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer
          ${isDragging ? "border-emerald-500 bg-emerald-50" : "border-slate-300 hover:border-slate-400 bg-slate-50"}
          ${error ? "border-red-400 bg-red-50" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        <input id={inputId} type="file" accept={accept} onChange={handleChange} className="hidden" />
        {value ? (
          <div className="flex items-center justify-center gap-3">
            <Check className="w-5 h-5 text-emerald-600" />
            <span className="text-sm text-slate-700 font-medium truncate max-w-[200px]">{value.name}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="p-1 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        ) : (
          <>
            <div className="text-slate-400 mx-auto mb-2 flex justify-center"><Upload /></div>
            <p className="text-sm text-slate-600">Drop file here or click to upload</p>
            <p className="text-xs text-slate-400 mt-1">{hint}</p>
          </>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Dynamic List Component
const DynamicList: React.FC<DynamicListProps> = ({ values, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState<string>("");

  const addItem = () => {
    if (inputValue.trim()) {
      onChange([...values, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeItem = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
        />
        <button
          type="button"
          onClick={addItem}
          className="px-4 py-3 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors"
        >
          <Plus />
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((item, index) => (
            <span key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm">
              {item}
              <button type="button" onClick={() => removeItem(index)} className="text-slate-400 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Form Component
export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    countryOfResidence: "",
    addressLine1: "",
    passportPhoto: null,
    cvResume: null,
    linkedinProfile: "",
    subjectsQualifications: [],
    otherDisciplines: "",
    accountNumber: "",
    bankName: "",
    accountType: "",
    taxIdNumber: "",
  });

  const steps: Step[] = [
    { id: 0, title: "Personal Info", icon: User },
    { id: 1, title: "Professional", icon: Briefcase },
    { id: 2, title: "Education", icon: GraduationCap },
    { id: 3, title: "Payment", icon: CreditCard },
  ];

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (currentStep === 0) {
      if (!formData.fullName || formData.fullName.length < 2) newErrors.fullName = "Full name must be at least 2 characters";
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email";
      if (!formData.phoneNumber || formData.phoneNumber.length < 10) newErrors.phoneNumber = "Please enter a valid phone number";
      if (!formData.countryOfResidence) newErrors.countryOfResidence = "Please select your country";
      if (!formData.addressLine1 || formData.addressLine1.length < 5) newErrors.addressLine1 = "Address must be at least 5 characters";
      if (!formData.passportPhoto) newErrors.passportPhoto = "Please upload a passport photo";
    }
    
    if (currentStep === 1) {
      if (!formData.cvResume) newErrors.cvResume = "Please upload your CV/Resumé";
      if (formData.linkedinProfile && !formData.linkedinProfile.startsWith("https://")) {
        newErrors.linkedinProfile = "LinkedIn URL must start with https://";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep() && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Form Data:", formData);
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  // Success Screen
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 max-w-lg w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Submitted!</h2>
          <p className="text-slate-600 mb-8">
            Thank you for applying to become an Image Annotation Specialist at Demers. We&apos;ll review your application and get back to you within 3-5 business days.
          </p>
          <p className="text-sm text-slate-500">Check your email for confirmation and next steps.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Demers</span>
          </div>
          <h1 className="text-xl text-emerald-400 font-medium mt-4">Image Annotation Specialist Application</h1>
          <p className="text-slate-400 text-sm mt-1">Remote • $2/hour • 20-40 hours/week</p>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
                    ${isActive ? "bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/30" : ""}
                    ${isCompleted ? "bg-emerald-600 text-white" : ""}
                    ${!isActive && !isCompleted ? "bg-white/10 text-slate-400" : ""}`}
                  >
                    {isCompleted ? <Check /> : <Icon />}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${isActive ? "text-emerald-400" : isCompleted ? "text-emerald-500" : "text-slate-500"}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${currentStep > index ? "bg-emerald-500" : "bg-white/10"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 md:p-10">
              
              {/* Step 1: Personal Information */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Personal Information</h2>
                    <p className="text-slate-500">Let&apos;s start with your basic details</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Full Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? "border-red-400" : "border-slate-200"} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all`}
                      />
                      {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Email <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="john@example.com"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.email ? "border-red-400" : "border-slate-200"} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all`}
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Phone Number <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => updateField("phoneNumber", e.target.value)}
                        placeholder="+254 700 000 000"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.phoneNumber ? "border-red-400" : "border-slate-200"} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all`}
                      />
                      {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Country of Residence <span className="text-red-500">*</span></label>
                      <select
                        value={formData.countryOfResidence}
                        onChange={(e) => updateField("countryOfResidence", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.countryOfResidence ? "border-red-400" : "border-slate-200"} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-white`}
                      >
                        <option value="">Select country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                      {errors.countryOfResidence && <p className="text-sm text-red-500">{errors.countryOfResidence}</p>}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Address Line 1 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.addressLine1}
                        onChange={(e) => updateField("addressLine1", e.target.value)}
                        placeholder="123 Main Street, Nairobi"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.addressLine1 ? "border-red-400" : "border-slate-200"} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all`}
                      />
                      {errors.addressLine1 && <p className="text-sm text-red-500">{errors.addressLine1}</p>}
                    </div>
                  </div>

                  <FileUpload
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    value={formData.passportPhoto}
                    onChange={(file) => updateField("passportPhoto", file)}
                    label="Passport-sized Photo *"
                    hint="JPG, PNG or WebP, max 5MB"
                    error={errors.passportPhoto}
                  />
                </div>
              )}

              {/* Step 2: Professional Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Professional Information</h2>
                    <p className="text-slate-500">Tell us about your professional background</p>
                  </div>

                  <FileUpload
                    accept=".pdf,.doc,.docx"
                    value={formData.cvResume}
                    onChange={(file) => updateField("cvResume", file)}
                    label="CV / Resumé *"
                    hint="PDF, DOC or DOCX, max 5MB"
                    error={errors.cvResume}
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">LinkedIn Profile</label>
                    <input
                      type="url"
                      value={formData.linkedinProfile}
                      onChange={(e) => updateField("linkedinProfile", e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className={`w-full px-4 py-3 rounded-xl border ${errors.linkedinProfile ? "border-red-400" : "border-slate-200"} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all`}
                    />
                    {errors.linkedinProfile && <p className="text-sm text-red-500">{errors.linkedinProfile}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Education & Skills */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Education & Skills</h2>
                    <p className="text-slate-500">Share your language skills and qualifications</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Subjects & Qualifications</label>
                    <DynamicList
                      values={formData.subjectsQualifications}
                      onChange={(values) => updateField("subjectsQualifications", values)}
                      placeholder="e.g., Computer Science, Data Analysis"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Other Subject Areas & Disciplines</label>
                    <textarea
                      value={formData.otherDisciplines}
                      onChange={(e) => updateField("otherDisciplines", e.target.value)}
                      rows={3}
                      placeholder="List other disciplines here if they don't appear above"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Payment Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Payment Details</h2>
                    <p className="text-slate-500">Optional — You can provide these later</p>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> Banking details are optional at this stage. You can add or update these after your application is approved.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Account Number</label>
                      <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => updateField("accountNumber", e.target.value)}
                        placeholder="Your bank account number"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Bank Name</label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => updateField("bankName", e.target.value)}
                        placeholder="e.g., Equity Bank, KCB"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Account Type</label>
                      <select
                        value={formData.accountType}
                        onChange={(e) => updateField("accountType", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-white"
                      >
                        <option value="">Select account type</option>
                        <option value="savings">Savings</option>
                        <option value="checking">Checking</option>
                        <option value="mobile_money">Mobile Money</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Tax ID Number</label>
                      <input
                        type="text"
                        value={formData.taxIdNumber}
                        onChange={(e) => updateField("taxIdNumber", e.target.value)}
                        placeholder="Your tax identification number"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="px-6 md:px-10 py-6 bg-slate-50 border-t border-slate-100 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  currentStep === 0 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <ChevronLeft />
                Back
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                >
                  Continue
                  <ChevronRight />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <Check />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>
            By submitting this application, you agree to Demers&apos;{" "}
            <a href="#" className="text-emerald-400 hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-emerald-400 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}