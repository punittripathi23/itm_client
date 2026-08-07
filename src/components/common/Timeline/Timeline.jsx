import React from 'react';
import { CheckCircle2, Clock, FileText, Send, Eye, Edit3, Award, Globe, XCircle } from 'lucide-react';
import './Timeline.css';

const STAGES = [
  { key: 'draft', label: 'Draft', icon: FileText },
  { key: 'submitted', label: 'Submitted', icon: Send },
  { key: 'under_review', label: 'Under Review', icon: Eye },
  { key: 'revision', label: 'Revision', icon: Edit3 },
  { key: 'accepted', label: 'Accepted', icon: Award },
  { key: 'published', label: 'Published', icon: Globe }
];

export const Timeline = ({ currentStatus = 'submitted', history = [] }) => {
  const normalizedStatus = (currentStatus || 'submitted').toLowerCase().replace(/\s+/g, '_');

  const getStageState = (stageKey, index) => {
    if (normalizedStatus === 'rejected') {
      return stageKey === 'submitted' ? 'completed' : stageKey === 'under_review' ? 'rejected' : 'upcoming';
    }

    const currentIndex = STAGES.findIndex(s => s.key === normalizedStatus);
    if (currentIndex === -1) return index === 0 ? 'active' : 'upcoming';

    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return 'upcoming';
  };

  return (
    <div className="lifecycle-timeline">
      <div className="timeline-track">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const state = getStageState(stage.key, idx);

          return (
            <div key={stage.key} className={`timeline-node ${state}`}>
              <div className="node-icon-wrapper">
                {state === 'completed' ? (
                  <CheckCircle2 size={18} className="node-icon-check" />
                ) : state === 'rejected' ? (
                  <XCircle size={18} className="node-icon-reject" />
                ) : (
                  <Icon size={16} className="node-icon-main" />
                )}
              </div>
              <span className="node-label">{stage.label}</span>
              {idx < STAGES.length - 1 && <div className={`timeline-line ${state === 'completed' ? 'filled' : ''}`} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
