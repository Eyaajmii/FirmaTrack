import CheptelItem from "./CheptelItem";

function CheptelList({ animals, onDelete }) {
  return (
    <div>
      {animals.map((animal) => (
        <CheptelItem key={animal.id} animal={animal} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default CheptelList;
