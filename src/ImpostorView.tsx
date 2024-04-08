import { Sabotage } from "./App";
import RoleInformation from "./RoleInformation";
import SabotageList from "./SabotageList";

type Props = {
  sabotages: Sabotage[];
};

export default function ImpostorView({ sabotages }: Props) {
  return (
    <div className="flex justify-between items-start p-4">
      <div className="flex-none">
        <SabotageList sabotages={sabotages} />
      </div>

      {/* Role Information in top center */}
      <div className="flex-grow flex justify-center">
        <RoleInformation role={"IMPOSTOR"} />
      </div>

      {/* Map Button on top right */}
      <div className="flex-none">
        <p>Map Button Component Goes Here</p>
      </div>
    </div>
  );
}
