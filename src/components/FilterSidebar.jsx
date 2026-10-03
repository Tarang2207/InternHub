function FilterSidebar({
  selectedModes,
  setSelectedModes,
  selectedDurations,
  setSelectedDurations,
  selectedTypes,
  setSelectedTypes,
  clearFilters,
}) {
  const handleModeChange = (mode) => {
    if (selectedModes.includes(mode)) {
      setSelectedModes(selectedModes.filter((item) => item !== mode));
    } else {
      setSelectedModes([...selectedModes, mode]);
    }
  };

  const handleDurationChange = (duration) => {
    if (selectedDurations.includes(duration)) {
      setSelectedDurations(
        selectedDurations.filter((item) => item !== duration),
      );
    } else {
      setSelectedDurations([...selectedDurations, duration]);
    }
  };

  const handleTypeChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((item) => item !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <aside className="filter-sidebar">
      <h3><button className="clear-filters" onClick={clearFilters}>
  Clear Filters
</button></h3>

      <div className="filter-group">
        <h4>Work Mode</h4>

        <label>
          <input
            type="checkbox"
            checked={selectedModes.includes("Remote")}
            onChange={() => handleModeChange("Remote")}
          />
          Remote
        </label>

        <label>
          <input
            type="checkbox"
            checked={selectedModes.includes("Hybrid")}
            onChange={() => handleModeChange("Hybrid")}
          />
          Hybrid
        </label>

        <label>
          <input
            type="checkbox"
            checked={selectedModes.includes("On-site")}
            onChange={() => handleModeChange("On-site")}
          />
          On-site
        </label>
      </div>

      <div className="filter-group">
        <h4>Internship Type</h4>

        <label>
          <input
            type="checkbox"
            checked={selectedTypes.includes("Full-time")}
            onChange={() => handleTypeChange("Full-time")}
          />
          Full-time
        </label>

        <label>
          <input
            type="checkbox"
            checked={selectedTypes.includes("Part-time")}
            onChange={() => handleTypeChange("Part-time")}
          />
          Part-time
        </label>
      </div>

      <div className="filter-group">
        <h4>Duration</h4>

        <label>
          <input
            type="checkbox"
            checked={selectedDurations.includes("3 Months")}
            onChange={() => handleDurationChange("3 Months")}
          />
          1–3 Months
        </label>

        <label>
          <input
            type="checkbox"
            checked={selectedDurations.includes("6 Months")}
            onChange={() => handleDurationChange("6 Months")}
          />
          3–6 Months
        </label>
      </div>
    </aside>
  );
}

export default FilterSidebar;
