import { http, HttpResponse } from 'msw';

export const handlers = [
  // MSW 작동이 잘 되는지 확인하기 위한 테스트용 API
  http.get('/api/v1/test', () => {
    return HttpResponse.json({ message: 'MSW 세팅 성공' });
  }),
];