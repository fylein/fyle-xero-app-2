import { OnboardingState } from "../enum/enum.model";

export type Workspace = {
  onboarding_state: OnboardingState;
  id: number;
  name: string;
  user: number[];
  fyle_org_id: string;
  xero_short_code: string;
  last_synced_at?: Date;
  source_synced_at: Date;
  destination_synced_at: Date;
  created_at: Date;
  updated_at: Date;
};
