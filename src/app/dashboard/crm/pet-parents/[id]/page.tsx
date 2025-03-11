import PetParentProfile from "@/components/crm/pet-parent-profile";

interface PetParentPageProps {
  params: {
    id: string;
  };
}

export default function PetParentPage({ params }: PetParentPageProps) {
  return <PetParentProfile petParentId={params.id} />;
}
