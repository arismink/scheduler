import React from 'react';
import PropTypes from 'prop-types'

import 'components/InterviewerList.scss'

import InterviewerListItem from './InterviewerListItem';

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

function InterviewerList(props) {

  const interviewersArray = props.interviewers.map(interviewer => {
    return (
      <InterviewerListItem
        key={interviewer.id}
        name={interviewer.name}
        avatar={interviewer.avatar}
        selected={interviewer.id === props.value}
        setInterviewer={() => props.onChange(interviewer.id)}
      />
    )
  })

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewersArray}
      </ul>
    </section>
  );
}

export default InterviewerList