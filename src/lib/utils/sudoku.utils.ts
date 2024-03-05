/**
 * 그리드의 크기
 */
const GRID_SIZE = 9;
/**
 * 박스의 크기
 */
const BOX_SIZE = 3;

/**
 * 사용 숫자
 */
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * 그리드 생성 함수
 * @description {rows} x {cols}의 2차원 배열을 0으로 초기화해서 반환한다.
 * @param {number} rows 행
 * @param {number} cols 열
 * @returns {number[][]} 0으로 초기화된 2차원 배열의 그리드
 */
const createGrid = (rows: number, cols: number): number[][] => {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
};

/**
 * 입력받은 값이 행, 열, 3x3 박스 안에 중복으로 존재하는지 체크
 * @description 그리드의 모든 셀의 값이 0이 아닐 경우 true 를 반환한다.
 * @param {number[][]} grid 2차원 배열
 * @param {number} row 행
 * @param {number} col 열
 * @param {number} value 값
 * @returns {boolean} 셀 값 중복 여부
 */
const isDuplicate = (
  grid: number[][],
  row: number,
  col: number,
  value: number
): boolean => {
  // 행 중복 체크
  for (let col = 0; col < GRID_SIZE; col++) {
    if (grid[row][col] === value) return false;
  }

  // 열 중복 체크
  for (let row = 0; row < GRID_SIZE; row++) {
    if (grid[row][col] === value) return false;
  }

  const rowOffset = Math.floor(row / BOX_SIZE) * BOX_SIZE; // 3x3 박스의 행 시작 인덱스
  const colOffset = Math.floor(col / BOX_SIZE) * BOX_SIZE; // 3x3 박스의 열 시작 인덱스

  // 3x3 박스 중복 체크
  for (let row = 0; row < BOX_SIZE; row++) {
    for (let col = 0; col < BOX_SIZE; col++) {
      if (grid[row + rowOffset][col + colOffset] === value) return false;
    }
  }

  return true;
};

/**
 * 그리드가 완성됐는지 체크하는 함수
 * @description 그리드의 모든 셀의 값이 0이 아닐 경우 true 를 반환한다.
 * @param {number[][]} grid 2차원 배열
 * @returns {boolean} 그리드 완성 여부
 */
const isFullGrid = (grid: number[][]): boolean => {
  return grid.every((row) => {
    return row.every((value) => {
      return value !== 0;
    });
  });
};

/**
 * 배열을 랜덤으로 섞어서 반환하는 함수
 * @description 배열의 수 만큼 랜덤으로 추출한 인덱스의 위치를 변경 하고 변경된 배열을 반환한다.
 * @param {number[]} array 숫자 배열
 * @returns {number[]} 랜덤으로 순서가 섞인 배열
 */
const shuffleArray = (array: number[]): number[] => {
  // 현재 인덱스
  let currentIdx = array.length;

  while (currentIdx !== 0) {
    // 랜덤 인덱스 추출
    const randomIdx = Math.floor(Math.random() * currentIdx);
    currentIdx -= 1;

    const temp = array[currentIdx]; // 현재 인덱스의 값을 임시로 저장
    array[currentIdx] = array[randomIdx]; // 랜덤 인덱스의 값을 현재 인덱스에 저장
    array[randomIdx] = temp; // 임시저장한 기존 값을 랜덤 인덱스에 저장
  }

  return array;
};

/**
 * 그리드에 랜덤 숫자를 채우는 함수
 * @description 백트래킹 알고리즘으로 그리드에 숫자를 채우고 성공 시 true 를 반환한다.
 * @param {number[][]} grid 랜덤 숫자를 채울 2차원 배열
 * @param {number} index 숫자를 채울 그리드의 순번 (default: 0)
 * @returns {boolean} 스도쿠 생성 완료 여부
 */
const createSudoku = (grid: number[][], index = 0): boolean => {
  const row = Math.floor(index / GRID_SIZE); // 행
  const col = index % GRID_SIZE; // 열

  // 그리드가 완성됐으면 백트래킹 종료
  if (isFullGrid(grid)) {
    return true;
  }

  // 이미 숫자가 있는 경우 다음 위치로 이동
  if (grid[row][col] !== 0) {
    if (createSudoku(grid, index + 1)) {
      return true;
    }
  }

  // 랜덤 숫자 배열
  const numberList = shuffleArray([...NUMBERS]);

  // 랜덤 숫자를 순서대로 셀에 기입해보면서 그리드 생성
  numberList.forEach((number) => {
    // 행, 열, 3x3 박스 안에 존재하는지 체크
    if (isDuplicate(grid, row, col, number)) {
      grid[row][col] = number; // 숫자 세팅
      // 세팅 후 다 찼을 경우 생성 종료
      if (isFullGrid(grid)) {
        return true;
      } else {
        // 빈칸이 있을 경우 추가 생성
        if (createSudoku(grid, index + 1)) {
          return true;
        }
      }
      // 문제가 생긴 경우 0으로 초기화 후 다음 숫자 실행 (백트래킹을 위한 상태 초기화)
      grid[row][col] = 0;
    }
  });

  return isFullGrid(grid);
};

/**
 * 랜덤숫자를 하나 반환하는 함수
 * @returns {number} 랜덤숫자
 */
const rand = (): number => Math.floor(Math.random() * GRID_SIZE);

/**
 * 완성된 스도쿠 그리드에 대칭 구조로 랜덤하게 셀을 삭제하는 함수
 * @param {number[][]} grid 완성된 2차원 배열의 스도쿠 그리드
 * @param {number} deletionsCount 삭제할 셀의 개수
 * @returns {number[][]} 셀이 삭제된 후의 스도쿠 그리드
 */
const removeCells = (grid: number[][], deletionsCount: number): number[][] => {
  // 삭제된 후 반환할 그리드
  let res = grid.map((v) => [...v]);
  // 삭제 시도 횟수
  let attemps = deletionsCount;

  while (attemps > 0) {
    // 랜덤으로 행과 열의 값을 추출
    let row = rand();
    let col = rand();

    // 추출된 값이 이미 삭제되어있다면 재할당
    while (res[row][col] === 0) {
      row = rand();
      col = rand();
    }

    // 반전했을 때의 행, 열 위치
    const reverseRow = GRID_SIZE - 1 - row;
    const reverseCol = GRID_SIZE - 1 - col;

    // 0 으로 세팅
    res[row][col] = 0;
    res[reverseRow][reverseCol] = 0;

    // 대칭으로 뒤집었을때 동일한 셀인경우 삭제 시도 횟수 하나만 차감
    if (row === reverseRow && col === reverseCol) {
      attemps--;
    } else {
      attemps -= 2;
    }
  }
  return res;
};

/**
 * 스도쿠 생성 함수
 * @description 입력받은 셀의 개수만큼 제거된 스도쿠 문제와 정답을 반환한다.
 * @param deletionsCount 삭제할 셀의 개수
 */
export const sudokuGen = (
  deletionsCount: number
): { solution: number[][]; question: number[][] } => {
  // 1. 그리드 생성
  const board = createGrid(GRID_SIZE, GRID_SIZE);

  // 2. 퍼즐 생성
  const isCreated = createSudoku(board);

  // 퍼즐 생성이 실패할 경우 그리드 반환
  if (!isCreated) {
    return { solution: board, question: board };
  }
  // 3. 숫자 제거
  const question = removeCells(board, deletionsCount);

  return { solution: board, question };
};
