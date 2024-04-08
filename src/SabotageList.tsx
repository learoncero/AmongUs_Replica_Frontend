import { useState } from "react";
import SabotageListItem from "./SabotageListItem";
import { Sabotage } from "./App";

type Props = {
  sabotages: Sabotage[];
};

export default function SabotageList({ sabotages }: Props) {
  const [incompleteSabotages, setIncompleteSabotages] = useState(sabotages);
  const [completedSabotages, setCompletedSabotages] = useState([]);

  function handleSabotageComplete(sabotageId) {
    const sabotageIndex = incompleteSabotages.findIndex(
      (sabotage) => sabotage.id === sabotageId
    );
    if (sabotageIndex !== -1) {
      const completedSabotage = incompleteSabotages[sabotageIndex];
      setCompletedSabotages([...completedSabotages, completedSabotage]);
      const updatedSabotages = incompleteSabotages.filter(
        (sabotage) => sabotage.id !== sabotageId
      );
      setIncompleteSabotages(updatedSabotages);
    }
  }

  const displayedSabotages = incompleteSabotages.slice(0, 2);

  return (
    <div className="sabotageList bg-black text-white border border-gray-600 shadow-md rounded-lg p-4 font-sans text-sm w-full max-w-lg min-h-64 min-w-80">
      <h2 className="text-lg font-semibold mb-4">Sabotages</h2>
      <ul className="overflow-x-hidden">
        {displayedSabotages.map((sabotage) => (
          <SabotageListItem
            key={sabotage.id}
            sabotage={sabotage}
            onComplete={() => handleSabotageComplete(sabotage.id)}
          />
        ))}
      </ul>
    </div>
  );
}
