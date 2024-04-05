import { Insight } from '../../types';
import React from 'react';

interface InsightItemProps {
 insight: Insight;
}

export const InsightItem: React.FC<InsightItemProps> =({insight})=> {
  return (
    <div key={insight._id}>
      <h3>{insight.title}</h3>
      <p>{insight.insight}</p>
    </div>
  );
};

