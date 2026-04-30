function CheptelItem({ animal, onDelete, onSelect }) {
  return (
    <div>
      <p>
        <b>ID:</b> {animal.id} |<b>Numéro:</b> {animal.chepnumber} |<b>Nom:</b>{" "}
        {animal.nom} |<b>Type:</b> {animal.type} |<b>Race:</b> {animal.race} |
        <b>Statut:</b> {animal.statut}
      </p>

      <button onClick={() => onDelete(animal.id)}>Supprimer</button>
    </div>
  );
}

export default CheptelItem;
