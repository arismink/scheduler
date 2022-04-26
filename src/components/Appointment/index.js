import React from 'react';
import './styles.scss'

import Header from 'components/Appointment/Header';
import Form from './Form';

import Status from './Status';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Confirm from './Confirm';
import Error from './Error';

import useVisualMode from 'hooks/useVisualMode';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVE = "SAVE";
const DELETE = "DELETE";
const CONFIRM= "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE"

export default function Appointment(props) {

  function save(name, interviewer) {
    if (!name || !interviewer) return alert('Please enter valid input.');

    transition(SAVE, true);
    const interview = {
      student: name,
      interviewer
    };

    // When promise returned by axios put request is resolved, transition to SHOW
    props
      .bookInterview(props.id, interview)
      .then(res => transition(SHOW))
      .catch(err => transition(ERROR_SAVE, true));
  
  };

  // After confirmed, delete
  function _delete() {
    transition(DELETE, true);

    props
      .cancelInterview(props.id)
      .then(res => transition(EMPTY))
      .catch(err => transition(ERROR_DELETE, true))
  }

  const {mode, transition, back} = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return (
    <article className="appointment">
      <Header time={props.time} />
      
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}

      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}

      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}

      {mode === SAVE && <Status message="Saving"/>}

      {mode === DELETE && <Status message="Deleting" />}

      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onConfirm={_delete}
          onCancel={back}
        />)}

      {mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}

      {mode === ERROR_SAVE && (
        <Error
          message="Error saving interview. Please try again."
          onClose={back}
        />
      )}

      {mode === ERROR_DELETE && (
        <Error
          message="Error cancelling interview. Please try again."
          onClose={back}
        />
      )}
      
    </article>
  )
};
