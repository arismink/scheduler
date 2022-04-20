import React from 'react';
import DayListItem from './DayListItem';

export default function DayList(props) {

  const daysArray = props.days.map(day => {
    return (
      <DayListItem
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={day.selected}
        setDay={props.setDay}
      />
    )
  })

  return (
    <ul>
      {daysArray}
    </ul>
  )
}