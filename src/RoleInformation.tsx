type Props = {
  role: "CREWMATE" | "IMPOSTOR";
};

export default function RoleInformation({ role }: Props) {
  return (
    <div className="roleInformation bg-black text-white border border-gray-600 shadow-md rounded-lg p-4 font-sans text-sm w-full max-w-md">
      <div className="flex items-center border-b border-gray-400 mb-2 pb-2">
        <p className="text-lg font-semibold">Role:</p>
        <p className="ml-2 text-lg font-semibold">{role}</p>
      </div>
    </div>
  );
}
