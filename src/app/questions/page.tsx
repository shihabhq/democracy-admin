"use client";

import { useState, useEffect } from "react";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  Question,
} from "@/lib/api";
import Link from "next/link";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      const data = await getQuestions();
      setQuestions(data);
      setError("");
    } catch {
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      await deleteQuestion(id);
      fetchQuestions();
    } catch {
      alert("Failed to delete question");
    }
  }

  async function handleToggleActive(question: Question) {
    try {
      await updateQuestion(question.id, { isActive: !question.isActive });
      fetchQuestions();
    } catch {
      alert("Failed to update question");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Questions</h1>
            <div className="flex gap-4">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/questions"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Questions
              </Link>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingQuestion(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Question
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {showForm && (
          <QuestionForm
            question={editingQuestion}
            onClose={() => {
              setShowForm(false);
              setEditingQuestion(null);
            }}
            onSuccess={() => {
              setShowForm(false);
              setEditingQuestion(null);
              fetchQuestions();
            }}
          />
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Options
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {questions.map((question) => (
                <tr key={question.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {question.text.substring(0, 80)}
                      {question.text.length > 80 ? "..." : ""}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {question.options.length} options
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        question.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {question.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleToggleActive(question)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      {question.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingQuestion(question);
                        setShowForm(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function QuestionForm({
  question,
  onClose,
  onSuccess,
}: {
  question: Question | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [text, setText] = useState(question?.text || "");
  const [explanation, setExplanation] = useState(question?.explanation || "");
  const [options, setOptions] = useState<
    { text: string; isCorrect: boolean }[]
  >(
    question?.options.map((opt) => ({
      text: opt.text,
      isCorrect: opt.isCorrect,
    })) || [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const correctCount = options.filter((opt) => opt.isCorrect).length;
    if (correctCount !== 1) {
      alert("Exactly one option must be marked as correct");
      return;
    }
    setSaving(true);
    try {
      if (question) {
        await updateQuestion(question.id, { text, explanation, options });
      } else {
        await createQuestion({ text, explanation, options });
      }
      onSuccess();
    } catch {
      alert("Failed to save question");
    } finally {
      setSaving(false);
    }
  }

  function addOption() {
    setOptions([...options, { text: "", isCorrect: false }]);
  }

  function removeOption(index: number) {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  }

  function updateOption(
    index: number,
    field: "text" | "isCorrect",
    value: string | boolean
  ) {
    const newOptions = [...options];
    if (field === "isCorrect" && value === true) {
      // If marking this option as correct, unmark all others
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    } else {
      newOptions[index] = { ...newOptions[index], [field]: value };
    }
    setOptions(newOptions);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {question ? "Edit Question" : "Add Question"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Explanation <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Add an explanation shown after the quiz (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Options
                </label>
                <button
                  type="button"
                  onClick={addOption}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Option
                </button>
              </div>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) =>
                        updateOption(index, "text", e.target.value)
                      }
                      required
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct-option"
                        checked={option.isCorrect}
                        onChange={(e) =>
                          updateOption(index, "isCorrect", e.target.checked)
                        }
                      />
                      <span className="text-sm">Correct</span>
                    </label>
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : question ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
