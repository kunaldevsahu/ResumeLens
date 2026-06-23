"use client";

import { useEffect, useState } from "react";

type ResumeFormValues = {
  title: string;
  summary: string;
  skills: string;
};

type ResumeFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<ResumeFormValues>;
  onSubmit: (values: ResumeFormValues) => Promise<void> | void;
  submitLabel?: string;
};

const defaultValues: ResumeFormValues = {
  title: "",
  summary: "",
  skills: "",
};

export default function ResumeForm({
  mode,
  initialValues,
  onSubmit,
  submitLabel,
}: ResumeFormProps) {
  const [values, setValues] = useState<ResumeFormValues>(
    {
      ...defaultValues,
      ...initialValues,
    }
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setValues({
      ...defaultValues,
      ...initialValues,
    });
  }, [initialValues]);

  const handleChange = (
    field: keyof ResumeFormValues,
    value: string
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSubmitting(true);

    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          value={values.title}
          onChange={(event) =>
            handleChange("title", event.target.value)
          }
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          placeholder="Resume title"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Summary
        </label>
        <textarea
          value={values.summary}
          onChange={(event) =>
            handleChange("summary", event.target.value)
          }
          className="min-h-32 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          placeholder="Short professional summary"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Skills
        </label>
        <textarea
          value={values.skills}
          onChange={(event) =>
            handleChange("skills", event.target.value)
          }
          className="min-h-28 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          placeholder="Comma-separated skills or bullet text"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
      >
        {submitting
          ? "Saving..."
          : submitLabel ??
            (mode === "create" ? "Create Resume" : "Update Resume")}
      </button>
    </form>
  );
}