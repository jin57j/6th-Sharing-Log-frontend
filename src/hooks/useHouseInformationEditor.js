import { useState } from "react";

import useUpdateHouse from "./useUpdateHouse";

export default function useHouseInformationEditor({ house, onUpdated }) {
  const [editingField, setEditingField] = useState(null);
  const updateHouse = useUpdateHouse({
    house,
    onSuccess: (updatedGroup) => {
      onUpdated(updatedGroup);
      setEditingField(null);
    },
  });

  function startEditing(field) {
    updateHouse.resetHouseInformation();
    setEditingField(field);
  }

  function cancelEditing() {
    updateHouse.resetHouseInformation();
    setEditingField(null);
  }

  return {
    editingField,
    startEditing,
    cancelEditing,
    updateHouse,
  };
}
