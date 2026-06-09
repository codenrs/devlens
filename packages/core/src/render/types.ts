export type RenderRecord = {
  id: string;
  componentName: string;
  renderCount: number;
  duration: number;
  timestamp: number;
};

export type RenderSnapshot = {
  records: RenderRecord[];
  lastUpdatedAt: number;
};
