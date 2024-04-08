import { Sabotage } from "./App";

type Props = {
  sabotage: Sabotage;
  onComplete(): void;
};

export default function SabotageListItem({ sabotage, onComplete }: Props) {
  return (
    <li className="bg-gray-700 bg-opacity-70 rounded-md p-2 mb-2">
      <span className="block font-semibold">{sabotage.title}</span>
      <p className="text-xs">{sabotage.description}</p>
      <button
        className="text-xs text-blue-500 hover:underline mt-1"
        onClick={onComplete}
      >
        Complete
      </button>
    </li>
  );
}
