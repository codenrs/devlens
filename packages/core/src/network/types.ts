export type NetworkRequestStatus = 'pending' | 'success' | 'error';

export interface NetworkRequestRecord {
  id: string;
  url: string;
  method: string;
  status: NetworkRequestStatus;
  statusCode?: number;
  startTime: number;
  endTime?: number;
  duration?: number;
  isSlow?: boolean;
  errorMessage?: string;
}
