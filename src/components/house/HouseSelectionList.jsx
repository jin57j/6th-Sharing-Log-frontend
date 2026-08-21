import HouseSelectionItem from "./HouseSelectionItem";

function HouseSelectionList({
  groups,
  isLoading,
  errorMessage,
  onSelectGroup,
}) {
  if (isLoading) {
    return (
      <p
        role="status"
        className="mb-5 rounded-2xl bg-white px-4 py-5 text-center text-sm font-semibold text-[#8B8575] shadow-sm"
      >
        가입한 하우스를 불러오는 중이에요...
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p
        role="alert"
        className="mb-5 rounded-2xl border border-[#E63946]/20 bg-white px-4 py-4 text-sm font-semibold text-[#E63946]"
      >
        {errorMessage}
      </p>
    );
  }

  if (groups.length === 0) {
    return (
      <p className="mb-6 rounded-2xl bg-[#EFEBE2]/70 px-4 py-5 text-center text-sm font-semibold leading-6 text-[#8B8575]">
        아직 참여 중인 하우스가 없어요.
        <br />새 하우스를 만들거나 초대코드로 참가해 주세요.
      </p>
    );
  }

  return (
    <section className="mb-6">
      <h2 className="mb-3 text-sm font-black text-[#1A1428]">
        참여 중인 하우스
      </h2>
      <div className="space-y-2">
        {groups.map((group) => (
          <HouseSelectionItem
            key={group.groupPublicId}
            group={group}
            onSelect={onSelectGroup}
          />
        ))}
      </div>
    </section>
  );
}

export default HouseSelectionList;
