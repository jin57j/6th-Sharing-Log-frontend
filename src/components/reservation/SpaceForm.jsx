import { useState } from "react";

function SpaceForm({ onAddSpace }) {
  const [newSpaceName, setNewSpaceName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = newSpaceName.trim();

    if (!name) {
      onAddSpace(""); // 빈 값일 때 경고 메시지 처리를 위해 호출
      return;
    }

    onAddSpace(name);
    setNewSpaceName("");
  };

  return (
    <section>
      <h2>공간 추가</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="new-space">공간 이름</label>

        <input
          id="new-space"
          type="text"
          value={newSpaceName}
          onChange={(event) => setNewSpaceName(event.target.value)}
          placeholder="예: 옥상 테라스"
        />

        <button type="submit">공간 추가</button>
      </form>
    </section>
  );
}

export default SpaceForm;