import { useState } from "react";

import { mockTasks } from "../mocks/rotationData";

export default function useRotation() {
  const [selectedFrequency, setSelectedFrequency] = useState("WEEKLY");

  const filteredTasks = mockTasks.filter(
    (task) => task.frequency === selectedFrequency,
  );

  return {
    selectedFrequency,
    setSelectedFrequency,
    filteredTasks,
  };
}