function CheptelFilter({ onFilter, onSearch }) {
  return (
    <div>
      <input
        placeholder="Rechercher par tag"
        onChange={(e) => onSearch(e.target.value)}
      />

      <select onChange={(e) => onFilter(e.target.value)}>
        <option value="">Tous</option>
        <option value="ALIVE">ALIVE</option>
        <option value="SOLD">SOLD</option>
        <option value="DEAD">DEAD</option>
        <option value="ARCHIVED">ARCHIVED</option>
      </select>
    </div>
  );
}

export default CheptelFilter;
