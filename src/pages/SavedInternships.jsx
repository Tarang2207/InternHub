import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import internships from "../data/internships";

function SavedInternships() {
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("savedInternships");

    if (saved) {
      setSavedIds(JSON.parse(saved));
    }
  }, []);

  const removeBookmark = (internshipId) => {
    const updatedIds = savedIds.filter((id) => id !== internshipId);

    setSavedIds(updatedIds);

    localStorage.setItem("savedInternships", JSON.stringify(updatedIds));
  };

  const savedInternships = internships.filter((internship) =>
    savedIds.includes(internship.id),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Saved Internships
            </h1>

            <p className="mt-2 text-slate-500">
              Internships you have bookmarked for later.
            </p>
          </div>

          <Link to="/" className="text-sky-500 hover:text-sky-600 font-medium">
            ← Browse Internships
          </Link>
        </div>

        {savedInternships.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-4">🔖</div>

            <h2 className="text-xl font-bold text-slate-900">
              No saved internships
            </h2>

            <p className="mt-2 text-slate-500">
              Bookmark internships you're interested in and find them here.
            </p>

            <Link
              to="/"
              className="inline-block mt-6 px-5 py-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold"
            >
              Explore Internships
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {savedInternships.map((internship) => (
              <div
                key={internship.id}
                className="bg-white border border-slate-200 rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-sky-50 text-sky-500 text-xl font-bold">
                    {internship.logo}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-slate-900">
                      {internship.title}
                    </h2>

                    <p className="text-slate-500 mt-1">{internship.company}</p>

                    <div className="flex flex-wrap gap-3 mt-4 text-sm text-slate-600">
                      <span>📍 {internship.location}</span>
                      <span>💼 {internship.mode}</span>
                      <span>⏱ {internship.duration}</span>
                    </div>

                    <p className="mt-4 font-bold text-sky-500">
                      {internship.stipend}
                    </p>

                    <div className="flex gap-3 mt-4">
                      <Link
                        to={`/internship/${internship.id}`}
                        className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold"
                      >
                        View Details
                      </Link>

                      <button
                        onClick={() => removeBookmark(internship.id)}
                        className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold"
                      >
                        🔖 Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedInternships;
