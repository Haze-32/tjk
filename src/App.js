import React, { useState } from 'react';
import './App.css';

const autoCheckDates = [
  '2025-04-15',
  '2025-06-20',
];

function isAutoCheckDate(date) {
  const dateString = date.toISOString().split('T')[0];
  return autoCheckDates.includes(dateString);
}

function TrackerCalendar() {
  const startDate = new Date('2025-03-11');
  const endDate = new Date('2025-06-26');
  const [marks, setMarks] = useState({}); // State to track marks for each date
  const [activeBox, setActiveBox] = useState(null); // State to track which box's options are open

  const updateNotifier = (weekDates) => {
    const allChecks = weekDates.every(date => marks[date] === '✓' || isAutoCheckDate(new Date(date)));
    const hasX = weekDates.some(date => marks[date] === '✗');
    if (allChecks && weekDates.length === 5) return '$';
    if (hasX) return '✗';
    return '';
  };

  const handleBoxClick = (date) => {
    if (isAutoCheckDate(new Date(date))) return; // Skip locked dates
    setActiveBox(activeBox === date ? null : date); // Toggle options visibility
  };

  const handleOptionClick = (date, newMark) => {
    setMarks(prev => {
      const currentMark = prev[date];
      if (currentMark === newMark) {
        const { [date]: _, ...rest } = prev; // Remove mark if same is clicked
        return rest;
      }
      return { ...prev, [date]: newMark }; // Set new mark
    });
    setActiveBox(null); // Close options
  };

  const generateCalendar = () => {
    let currentDate = new Date(startDate);
    const months = [];

    while (currentDate <= endDate) {
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
      if (currentDate > endDate) break;

      const currentMonth = currentDate.getMonth();
      const monthName = currentDate.toLocaleString('default', { month: 'long' });
      const weeks = [];

      while (currentDate.getMonth() === currentMonth && currentDate <= endDate) {
        const weekStart = new Date(currentDate);
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekEnd.getDate() + 4);
        if (weekEnd > endDate) weekEnd.setTime(endDate.getTime());

        const weekDates = [];
        const boxes = [];
        for (let i = 0; i < 5 && currentDate <= endDate; i++) {
          const dateString = currentDate.toISOString().split('T')[0];
          const isLocked = isAutoCheckDate(currentDate);
          const mark = isLocked ? '✓' : marks[dateString] || '';
          weekDates.push(dateString);

          boxes.push(
            <div
              key={dateString}
              className={`tracker-box ${isLocked ? 'locked' : ''} ${mark === '✓' ? 'checked' : ''} ${mark === '✗' ? 'crossed' : ''}`}
              data-date={dateString}
              onClick={() => handleBoxClick(dateString)}
            >
              <span className="mark">{mark}</span>
              <div className={`options ${activeBox === dateString ? 'active' : ''}`}>
                <span className="option" data-mark="✓" onClick={(e) => { e.stopPropagation(); handleOptionClick(dateString, '✓'); }}>✓</span>
                <span className="option" data-mark="✗" onClick={(e) => { e.stopPropagation(); handleOptionClick(dateString, '✗'); }}>✗</span>
              </div>
            </div>
          );
          currentDate.setDate(currentDate.getDate() + 1);
          while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }

        const notifierText = updateNotifier(weekDates);
        weeks.push(
          <div className={`week-row ${notifierText === '$' ? 'success' : notifierText === '✗' ? 'failure' : ''}`} key={weekStart.toISOString()}>
            <div className="week-label">
              {`${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            </div>
            {boxes}
            <div className="notifier" style={{ color: notifierText === '$' ? '#27ae60' : notifierText === '✗' ? '#e74c3c' : 'inherit' }}>
              {notifierText}
            </div>
          </div>
        );
      }

      months.push(
        <div className="month-section" key={monthName}>
          <div className="month-header">{monthName}</div>
          {weeks}
        </div>
      );
    }

    return months;
  };

  return (
    <div className="tracker-container">
      <h1>Tracker Calendar (Mar 10 // Jun 26)</h1>
      <div id="calendar">{generateCalendar()}</div>
    </div>
  );
}

export default TrackerCalendar;