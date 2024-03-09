/**
 * 화면 타입
 */
type TView = "main" | "game" | "complete";

/**
 * 레벨 정보
 */
interface ILevel {
  /** 레벨명 */
  name: string;
  /** 삭제할 숫자의 수 */
  deletionsCount: number;
}

/**
 * 스도쿠 정보
 */
interface ISudoku {
  /** 스도쿠 정답 */
  solution: number[][];
  /** 스도쿠 문제 */
  question: number[][];
}

