
export interface MentorshipRelationshipAttributes {
  id: number;
  mentee_id: number;
  mentor_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  preferred_domain?: String[];
  preferred_communication: String[];
  problem: string;
  mentee_status:string

  }
  