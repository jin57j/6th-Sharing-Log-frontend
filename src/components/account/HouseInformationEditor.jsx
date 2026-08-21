import { House, MapPin } from "lucide-react";

import useHouseInformationEditor from "../../hooks/useHouseInformationEditor";
import EditableHouseInformationRow from "./EditableHouseInformationRow";
import HouseInformationEditForm from "./HouseInformationEditForm";

function HouseInformationEditor({ house, onUpdated }) {
  const editor = useHouseInformationEditor({ house, onUpdated });
  const update = editor.updateHouse;
  const isEditing = editor.editingField !== null;

  return (
    <div>
      {editor.editingField === "name" ? (
        <HouseInformationEditForm
          icon={House}
          inputId="account-house-name"
          label="하우스 이름"
          value={update.houseName}
          onChange={update.handleHouseNameChange}
          maxLength={update.maxHouseNameLength}
          placeholder="하우스 이름을 입력해 주세요"
          helpText="1자 이상 50자 이하"
          isValid={update.isHouseNameValid}
          showValidationError={
            !update.isHouseNameValid && update.houseName.length > 0
          }
          validationMessage="하우스 이름은 1자 이상 50자 이하로 입력해 주세요."
          hasChanged={update.hasHouseInformationChanged}
          isSaving={update.isSaving}
          errorMessage={update.errorMessage}
          onCancel={editor.cancelEditing}
          onSubmit={update.handleSubmit}
        />
      ) : (
        <EditableHouseInformationRow
          icon={House}
          label="하우스 이름"
          value={house.groupName}
          disabled={isEditing}
          onEdit={() => editor.startEditing("name")}
        />
      )}

      {editor.editingField === "address" ? (
        <HouseInformationEditForm
          icon={MapPin}
          inputId="account-house-address"
          label="주소"
          value={update.houseAddress}
          onChange={update.handleHouseAddressChange}
          maxLength={update.maxAddressLength}
          placeholder="하우스 주소를 입력해 주세요"
          helpText="비워두면 등록된 주소가 삭제돼요."
          isValid={update.isAddressValid}
          showValidationError={!update.isAddressValid}
          validationMessage="주소는 255자 이하로 입력해 주세요."
          hasChanged={update.hasHouseInformationChanged}
          isSaving={update.isSaving}
          errorMessage={update.errorMessage}
          onCancel={editor.cancelEditing}
          onSubmit={update.handleSubmit}
        />
      ) : (
        <EditableHouseInformationRow
          icon={MapPin}
          label="주소"
          value={house.groupAddress || "등록된 주소가 없어요"}
          disabled={isEditing}
          onEdit={() => editor.startEditing("address")}
        />
      )}
    </div>
  );
}

export default HouseInformationEditor;
