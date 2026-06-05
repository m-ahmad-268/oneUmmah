import React from 'react';
import { Link } from 'react-router-dom';
import { Progress, Menu, Modal } from 'antd';
import PropTypes from 'prop-types';
import UilellipsisH from '@iconscout/react-unicons/icons/uil-ellipsis-h';
import { Cards } from '../../components/cards/frame/cards-frame';
import { ProjectCard } from '../../layout/Style';

function EventGridCard({ value, onEdit, onDelete, onSetBudget, onView }) {
  const {
    serEventMasterId,
    eventCode,
    clientJourneyStepsCompleted,
    clientJourneyTotalSteps,
    eventJourneyProgress,
    title,
  } = value;

  // Correctly calculate the percentage and round it to two decimal places
  const clientJourneyPercentage =
    clientJourneyTotalSteps > 0 ? ((clientJourneyStepsCompleted / clientJourneyTotalSteps) * 100).toFixed(2) : 0;

  // Round the event journey progress to two decimal places
  const eventJourneyProgressRounded = parseFloat(eventJourneyProgress).toFixed(2);

  const cardMoreContent = (
    <Menu>
      <Menu.Item key="view" onClick={() => onView(value)}>
        View
      </Menu.Item>
      <Menu.Item key="edit" onClick={() => onEdit(value)}>
        Edit
      </Menu.Item>
      <Menu.Item key="set-budget" onClick={() => onSetBudget(serEventMasterId)}>
        Set Budget
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => onDelete(serEventMasterId, title)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <ProjectCard>
      <Cards headless title={title} more={cardMoreContent}>
        <div className="project-content">
          <p className="text-sm text-gray-600 truncate mb-2">Event Code: {eventCode}</p>
          <div className="project-details project-details-event">
            <p className="project-desc text-sm">
              Client Journey: {clientJourneyStepsCompleted}/{clientJourneyTotalSteps} steps completed
            </p>
            <Progress
              percent={clientJourneyPercentage}
              status={clientJourneyPercentage === 100 ? 'success' : 'active'}
              showInfo={true}
              format={(percent) => `${percent}%`}
              className="mt-1"
            />
            <p className="project-desc mt-2 text-sm">Event Journey: {eventJourneyProgressRounded}% progress</p>
            <Progress
              percent={eventJourneyProgressRounded}
              status={eventJourneyProgressRounded === 100 ? 'success' : 'active'}
              showInfo={true}
              format={(percent) => `${percent}%`}
              className="mt-1"
            />
          </div>
        </div>
        <div className="project-bottom"></div>
      </Cards>
    </ProjectCard>
  );
}

EventGridCard.propTypes = {
  value: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSetBudget: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};

export default EventGridCard;
