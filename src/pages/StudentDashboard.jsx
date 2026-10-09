import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const emptyProfile = {
  college: "",
  degree: "",
  branch: "",
  graduationYear: "",
  skills: [],
  bio: "",
  github: "",
  linkedin: "",
  portfolio: "",
};

function StudentDashboard() {
  const [profile, setProfile] = useState(emptyProfile);
  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/student-profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.profile) {
          const savedProfile = response.data.profile;

          setProfile({
            ...emptyProfile,
            ...savedProfile,
            graduationYear: savedProfile.graduationYear ?? "",
          });

          setSkillsInput((savedProfile.skills || []).join(", "));
        }
      } catch (error) {
        console.error("Fetch student profile error:", error);
        setMessage(error.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const updatedProfile = {
        ...profile,
        graduationYear: profile.graduationYear
          ? Number(profile.graduationYear)
          : null,
        skills: skillsInput
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const response = await axios.put(
        "http://localhost:5000/api/student-profile",
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProfile({
        ...emptyProfile,
        ...response.data.profile,
        graduationYear: response.data.profile.graduationYear ?? "",
      });

      setSkillsInput((response.data.profile.skills || []).join(", "));

      setMessage("Profile saved successfully!");
    } catch (error) {
      console.error("Save student profile error:", error);
      setMessage(error.response?.data?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading student profile...</p>;
  }

  return (
    <div className="student-dashboard">
      <button
        type="button"
        className="back-home-btn"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>
      
      <h1>Student Profile</h1>
      <p>Manage your education, skills, and professional links.</p>

      {message && <p role="status">{message}</p>}

      <form onSubmit={handleSave}>
        <label>
          College
          <input
            name="college"
            value={profile.college}
            onChange={handleChange}
          />
        </label>

        <label>
          Degree
          <input
            name="degree"
            value={profile.degree}
            onChange={handleChange}
            placeholder="e.g. BE"
          />
        </label>

        <label>
          Branch
          <input
            name="branch"
            value={profile.branch}
            onChange={handleChange}
            placeholder="e.g. ENTC"
          />
        </label>

        <label>
          Graduation Year
          <input
            name="graduationYear"
            type="number"
            min="2000"
            max="2100"
            value={profile.graduationYear}
            onChange={handleChange}
          />
        </label>

        <label>
          Skills (comma-separated)
          <input
            value={skillsInput}
            onChange={(event) => setSkillsInput(event.target.value)}
            placeholder="C++, React, JavaScript"
          />
        </label>

        <label>
          Bio
          <textarea name="bio" value={profile.bio} onChange={handleChange} />
        </label>

        <label>
          GitHub URL
          <input
            name="github"
            type="url"
            value={profile.github}
            onChange={handleChange}
          />
        </label>

        <label>
          LinkedIn URL
          <input
            name="linkedin"
            type="url"
            value={profile.linkedin}
            onChange={handleChange}
          />
        </label>

        <label>
          Portfolio URL
          <input
            name="portfolio"
            type="url"
            value={profile.portfolio}
            onChange={handleChange}
          />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default StudentDashboard;
