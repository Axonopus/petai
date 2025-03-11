import StaffProfile from "@/components/staff/staff-profile";

interface StaffProfilePageProps {
  params: {
    id: string;
  };
}

export default function StaffProfilePage({ params }: StaffProfilePageProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Staff Profile</h1>
      </div>
      <StaffProfile staffId={params.id} />
    </div>
  );
}
