/*
일단 모의 데이터로 구현해놓기는 했는데..
어떻게 실제로 띄울지 + 계산 로직은 백엔드랑 상의해봐야 할듯??
*/

// 홈 위에 뜨는 오늘(이번주) 할일 카드 데이터
export const mockMyTasks = [
    {
        id: 1,
        title: "거실 청소",
        icon: "🧹",
        frequency: "매주 반복 업무",
        timeLeft: "6일 3시간",
        isUrgent: false,
        // isUrgent > 이 업무가 긴급한지 여부..
        // true면 색이 빨간색으로 변해도 좋을듯???
    },
    {
        id: 2,
        title: "장보기",
        icon: "🛒",
        frequency: "매주 반복 업무",
        timeLeft: "7시간",
        isUrgent: true,
    },
];

// 홈 아래에 뜨는 공지사항 데이터
export const mockNotices = [
    {
        id: 1,
        title: "공지 1의 제목(MOCKDATA)",
        desc: "공지 1의 내용(MOCKDATA)",
        date: "오늘(MOCKDATA)",
    },
    {
        id: 2,
        title: "공지 2의 제목(MOCKDATA)",
        desc: "공지 2의 내용(MOCKDATA)",
        date: "어제(MOCKDATA)",
    },
    {
        id: 3,
        title: "공지 3의 제목(MOCKDATA)",
        desc: "공지 3의 내용(MOCKDATA)",
        date: "7월 13일(MOCKDATA)",
    },
];