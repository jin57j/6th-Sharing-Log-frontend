// 멤버 데이터를 가져옴(일단은 MOCKDATA에서 가져옴)
import { mockMembers } from "../mocks/rotationData";

/*
로테이션을 게산해주는 함수
돌아가면서 한명씩 이번주 담당자를 구해줌
대타, 교환 기능 등의 복잡해지는 로직은 추후에 구현 예정
아직 격주 업무도 매주 담당자를 정해주는 등의 문제가 있어 추후 개편 필요함
*/
export function getAssignee(task, roundIndex) {
    const rotationMemberIds = task.rotationMemberIds;
    const startIndex = rotationMemberIds.indexOf(task.startAssigneeId);
    const assigneeIndex = (startIndex + roundIndex) % rotationMemberIds.length;
    const assigneeId = rotationMemberIds[assigneeIndex];

    return mockMembers.find((member) => member.memberId === assigneeId);
    //이번주 담당자의 데이터를 뱉어냄
}
/*
<코드 설명>
task: 할일 MOCKDATE를 재료로 받음
roundIndex: 현재 이 할일이 만들어진 후 몇주차인지를 재료로 받음
*/