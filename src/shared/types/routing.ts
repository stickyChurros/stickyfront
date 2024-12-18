/**
 * 라우팅 정보 객체 타입
 * @interface
 * @property {string} path - 라우팅 경로
 * @property {Promise<unknown>} element - 라우팅 컴포넌트
 * @property {string} korean - 한글 이름
 * @property {boolean} expose - 헤더 노출 여부
 */

export interface routerInfoType {
  path: string;
  element: () => Promise<unknown>;
  korean?: string;
  expose?: boolean;
}
