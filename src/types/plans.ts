export interface PlanDetails {
  id: string;
  name: string;
  description: string;
  amount: number;
}

export interface Plans {
  petshop_pos: PlanDetails;
  petshop_pos_annual: PlanDetails;
  boarding: PlanDetails;
  boarding_annual: PlanDetails;
  daycare: PlanDetails;
  daycare_annual: PlanDetails;
  grooming: PlanDetails;
  grooming_annual: PlanDetails;
  [key: string]: PlanDetails;
}

export const defaultPlan: PlanDetails = {
  id: '',
  name: 'Custom Plan',
  description: 'Custom subscription plan',
  amount: 20,
};