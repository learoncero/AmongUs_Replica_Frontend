import RoleInformation from "./RoleInformation";

export default function CrewmateView() {
  return (
    <div className="flex justify-between items-start p-4">
      <div className="flex-none">
        <p>Task List goes here</p>
      </div>

      <div className="flex-grow flex justify-center">
        <RoleInformation role={"CREWMATE"} />
      </div>

      {/* Map Button on top right */}
      <div className="flex-none">
        <p>Map Button Component Goes Here</p>
      </div>
    </div>
  );
}
