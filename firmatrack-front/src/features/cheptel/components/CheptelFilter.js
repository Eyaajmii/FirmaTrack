function CheptelFilter({ onFilter, onSearch }) {
  const inputClass = "p-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10";

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative flex-1 min-w-[200px]">
        <input
          placeholder="Rechercher par numéro..."
          className={`${inputClass} w-full pl-4`}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <select 
        onChange={(e) => onFilter(e.target.value)}
        className={`${inputClass} text-xs font-bold text-gray-500 px-4`}
      >
        <option value="">TOUS LES STATUTS</option>
        <option value="ALIVE">VIVANTS</option>
        <option value="SOLD">VENDUS</option>
        <option value="DEAD">DÉCÉDÉS</option>
      </select>
    </div>
  );
}

export default CheptelFilter;