import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import InternshipCard from "./components/InternshipCard";
import FilterSidebar from "./components/FilterSidebar";
import internships from "./data/internships";

import InternshipDetails from "./pages/InternshipDetails";
import SavedInternships from "./pages/SavedInternships";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import axios from "axios";
import internshipsData from "./data/internships";
import MyApplications from "./pages/MyApplications";

function Home() {
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModes, setSelectedModes] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState("default");

  const [savedInternships, setSavedInternships] = useState(() => {
    const saved = localStorage.getItem("savedInternships");
    return saved ? JSON.parse(saved) : [];
  });

  const [backendInternships, setBackendInternships] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/internships")
      .then((response) => {
        console.log("Backend internships:", response.data.internships);

        const formattedInternships = response.data.internships.map(
          (internship) => ({
            ...internship,
            id: internship._id,
            logo: internship.company.charAt(0).toUpperCase(),
          }),
        );

        console.log("Formatted internships:", formattedInternships);
        setBackendInternships(formattedInternships);
      })
      .catch((error) => {
        console.error("Failed to fetch internships:", error);
      });
  }, []);

  // Clear all filters and search term
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedModes([]);
    setSelectedDurations([]);
    setSelectedTypes([]);
  };

  // Toggle bookmark for an internship
  const toggleBookmark = (internshipId) => {
    setSavedInternships((prev) => {
      let updated;

      if (prev.includes(internshipId)) {
        updated = prev.filter((id) => id !== internshipId);
      } else {
        updated = [...prev, internshipId];
      }

      localStorage.setItem("savedInternships", JSON.stringify(updated));

      return updated;
    });
  };

  const filteredInternships = backendInternships.filter((internship) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      internship.title.toLowerCase().includes(search) ||
      internship.company.toLowerCase().includes(search) ||
      internship.location.toLowerCase().includes(search) ||
      internship.type.toLowerCase().includes(search) ||
      internship.mode.toLowerCase().includes(search) ||
      internship.duration.toLowerCase().includes(search) ||
      internship.skills.some((skill) => skill.toLowerCase().includes(search));

    const matchesMode =
      selectedModes.length === 0 || selectedModes.includes(internship.mode);

    const matchesDuration =
      selectedDurations.length === 0 ||
      selectedDurations.includes(internship.duration);

    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(internship.type);

    return matchesSearch && matchesMode && matchesDuration && matchesType;
  });

  const sortedInternships = [...filteredInternships].sort((a, b) => {
    if (sortBy === "stipend-high") {
      return (
        parseInt(b.stipend.replace(/\D/g, "")) -
        parseInt(a.stipend.replace(/\D/g, ""))
      );
    }

    if (sortBy === "stipend-low") {
      return (
        parseInt(a.stipend.replace(/\D/g, "")) -
        parseInt(b.stipend.replace(/\D/g, ""))
      );
    }

    return 0;
  });

  return (
    <div>
      <Navbar />

      <section className="hero">
        <p className="hero-tag">🚀 Start your career journey</p>

        <h1>
          Find Your <span>Next Internship</span>
        </h1>

        <p className="hero-text">
          Discover internships, build your skills, and take the next step toward
          your dream career.
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search internships, skills or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>Search</button>
        </div>
      </section>

      <section className="internships">
        <div className="section-heading">
          <div>
            <p className="section-tag">EXPLORE OPPORTUNITIES</p>
            <h2>Latest Internships</h2>
          </div>

          <div className="heading-actions">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort By</option>
              <option value="stipend-high">Stipend: High to Low</option>
              <option value="stipend-low">Stipend: Low to High</option>
            </select>

            <button className="view-all">View All →</button>
          </div>
        </div>

        <div className="internship-layout">
          <FilterSidebar
            selectedModes={selectedModes}
            setSelectedModes={setSelectedModes}
            selectedDurations={selectedDurations}
            setSelectedDurations={setSelectedDurations}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            clearFilters={clearFilters}
          />

          <div className="internship-list">
            {sortedInternships.length > 0 ? (
              sortedInternships.map((internship) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  onSelect={setSelectedInternship}
                  isSelected={selectedInternship?.id === internship.id}
                  isSaved={savedInternships.includes(internship.id)}
                  onBookmark={toggleBookmark}
                />
              ))
            ) : (
              <div className="no-results">
                <h3>No internships found</h3>
                <p>Try searching for another skill, company or location.</p>
              </div>
            )}
          </div>

          <div className="job-details">
            {selectedInternship ? (
              <>
                <div className="details-logo">{selectedInternship.logo}</div>

                <h3>{selectedInternship.title}</h3>

                <p className="details-company">{selectedInternship.company}</p>

                <div className="details-meta">
                  <p>📍 {selectedInternship.location}</p>
                  <p>💼 {selectedInternship.mode}</p>
                  <p>⏱ {selectedInternship.duration}</p>
                </div>

                <p className="details-stipend">{selectedInternship.stipend}</p>

                <div className="skills">
                  {selectedInternship.skills.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>

                <button className="details-apply-btn">Apply Now</button>
              </>
            ) : (
              <>
                <h3>Select an internship</h3>
                <p>Click on an internship to view its complete details.</p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/internship/:id" element={<InternshipDetails />} />

        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedInternships />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
