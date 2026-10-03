import { useParams, Link } from "react-router-dom";
import internships from "../data/internships";

function InternshipDetails() {
  const { id } = useParams();

  const internship = internships.find((item) => item.id === Number(id));

  if (!internship) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Internship not found
          </h1>

          <Link
            to="/"
            className="inline-block mt-5 text-sky-500 hover:text-sky-600"
          >
            ← Back to internships
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <Link to="/" className="text-sky-500 hover:text-sky-600 font-medium">
            ← Back to internships
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Internship Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Logo */}
            <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-sky-50 text-sky-500 text-3xl font-bold">
              {internship.logo}
            </div>

            {/* Basic Information */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">
                {internship.title}
              </h1>

              <p className="mt-2 text-lg text-slate-500">
                {internship.company}
              </p>

              <div className="flex flex-wrap gap-4 mt-5 text-sm text-slate-600">
                <span>📍 {internship.location}</span>
                <span>💼 {internship.mode}</span>
                <span>⏱ {internship.duration}</span>
                <span>📋 {internship.type}</span>
              </div>
            </div>

            {/* Stipend */}
            <div className="md:text-right">
              <p className="text-sm text-slate-500">Stipend</p>

              <p className="text-xl font-bold text-sky-500">
                {internship.stipend}
              </p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <section className="bg-white rounded-2xl border border-slate-200 p-7">
              <h2 className="text-xl font-bold text-slate-900">
                About the Internship
              </h2>

              <p className="mt-4 text-slate-600 leading-7">
                {internship.description}
              </p>
            </section>

            {/* Skills */}
            <section className="bg-white rounded-2xl border border-slate-200 p-7">
              <h2 className="text-xl font-bold text-slate-900">
                Skills Required
              </h2>

              <div className="flex flex-wrap gap-2 mt-4">
                {internship.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-2 rounded-lg bg-sky-50 text-sky-600 text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Responsibilities */}
            <section className="bg-white rounded-2xl border border-slate-200 p-7">
              <h2 className="text-xl font-bold text-slate-900">
                Responsibilities
              </h2>

              <ul className="mt-4 space-y-3 text-slate-600">
                {internship.responsibilities.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </section>

            {/* Requirements */}
            <section className="bg-white rounded-2xl border border-slate-200 p-7">
              <h2 className="text-xl font-bold text-slate-900">Requirements</h2>

              <ul className="mt-4 space-y-3 text-slate-600">
                {internship.requirements.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </section>

            {/* Benefits */}
            <section className="bg-white rounded-2xl border border-slate-200 p-7">
              <h2 className="text-xl font-bold text-slate-900">Benefits</h2>

              <ul className="mt-4 space-y-3 text-slate-600">
                {internship.benefits.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="bg-white rounded-2xl border border-slate-200 p-7 h-fit lg:sticky lg:top-6">
            <h2 className="text-xl font-bold text-slate-900">
              Internship Overview
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm text-slate-500">Location</p>
                <p className="mt-1 font-medium text-slate-900">
                  {internship.location}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Work Mode</p>
                <p className="mt-1 font-medium text-slate-900">
                  {internship.mode}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Duration</p>
                <p className="mt-1 font-medium text-slate-900">
                  {internship.duration}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Internship Type</p>
                <p className="mt-1 font-medium text-slate-900">
                  {internship.type}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Stipend</p>
                <p className="mt-1 font-bold text-sky-500">
                  {internship.stipend}
                </p>
              </div>
            </div>

            <button className="w-full mt-8 py-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold transition">
              Apply Now
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default InternshipDetails;
