import React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
import { FaClock, FaHourglassHalf, FaCalendarDay, FaCalendarWeek, FaCalendarAlt, FaTasks } from "react-icons/fa";

// Thành phần ViewSwitcher với icon từ react-icons
export const ViewSwitcher = ({ onViewModeChange, onViewListChange, isChecked }) => {
  return (
    <div className="ViewContainer">
      <button
        className="Button"
        onClick={() => onViewModeChange(ViewMode.QuarterDay)}
      >
        <FaClock /> Quarter of Day
      </button>
      <button
        className="Button"
        onClick={() => onViewModeChange(ViewMode.HalfDay)}
      >
        <FaHourglassHalf /> Half of Day
      </button>
      <button className="Button" onClick={() => onViewModeChange(ViewMode.Day)}>
        <FaCalendarDay /> Day
      </button>
      <button
        className="Button"
        onClick={() => onViewModeChange(ViewMode.Week)}
      >
        <FaCalendarWeek /> Week
      </button>
      <button
        className="Button"
        onClick={() => onViewModeChange(ViewMode.Month)}
      >
        <FaCalendarAlt /> Month
      </button>

      <div className="Switch">
        <label className="Switch_Toggle">
          <input
            type="checkbox"
            defaultChecked={isChecked}
            onChange={() => onViewListChange(!isChecked)}
          />
          <span className="Slider" />
        </label>
        <FaTasks /> Show Task List
      </div>
    </div>
  );
};
