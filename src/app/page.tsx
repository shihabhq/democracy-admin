"use client";

import { useState, useEffect } from "react";
import { getAnalytics, Analytics } from "@/lib/api";
import Link from "next/link";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch {
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">
          {error || "Failed to load analytics"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Attempts" value={analytics.totalAttempts} />
          <StatCard label="Passed" value={analytics.passedCount} />
          <StatCard label="Failed" value={analytics.failedCount} />
          <StatCard
            label="Avg Score"
            value={`${analytics.averageScore.toFixed(1)}%`}
          />
          <StatCard label="Certificates" value={analytics.totalCertificates} />
        </div>

        {/* Stats by District */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Stats by District</h2>
          {analytics.statsByDistrict.length === 0 ? (
            <p className="text-gray-500 text-sm">No attempts yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left font-medium text-gray-700">District</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Attempts</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Passed</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Avg Score %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics.statsByDistrict
                    .sort((a, b) => b.totalAttempts - a.totalAttempts)
                    .map((row) => (
                      <tr key={row.district}>
                        <td className="px-4 py-2 font-medium text-gray-900">{row.district}</td>
                        <td className="px-4 py-2 text-gray-600">{row.totalAttempts}</td>
                        <td className="px-4 py-2 text-gray-600">{row.passedCount}</td>
                        <td className="px-4 py-2 text-gray-600">{row.averageScore.toFixed(1)}%</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats by Age Group */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Stats by Age Group</h2>
          {analytics.statsByAgeGroup.length === 0 ? (
            <p className="text-gray-500 text-sm">No attempts yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Age Group</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Attempts</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Passed</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Avg Score %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics.statsByAgeGroup
                    .sort((a, b) => b.totalAttempts - a.totalAttempts)
                    .map((row) => (
                      <tr key={row.ageGroup}>
                        <td className="px-4 py-2 font-medium text-gray-900">{row.ageGroup}</td>
                        <td className="px-4 py-2 text-gray-600">{row.totalAttempts}</td>
                        <td className="px-4 py-2 text-gray-600">{row.passedCount}</td>
                        <td className="px-4 py-2 text-gray-600">{row.averageScore.toFixed(1)}%</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Question Difficulty */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Toughest Questions</h2>
            <div className="space-y-3">
              {analytics.toughestQuestions.slice(0, 5).map((q) => (
                <div key={q.questionId} className="border-b pb-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {q.text.substring(0, 100)}...
                  </p>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>
                      {q.correctAnswers}/{q.totalAnswers} correct
                    </span>
                    <span>{q.successRate.toFixed(1)}% success rate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Easiest Questions</h2>
            <div className="space-y-3">
              {analytics.easiestQuestions.slice(0, 5).map((q) => (
                <div key={q.questionId} className="border-b pb-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {q.text.substring(0, 100)}...
                  </p>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>
                      {q.correctAnswers}/{q.totalAnswers} correct
                    </span>
                    <span>{q.successRate.toFixed(1)}% success rate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
