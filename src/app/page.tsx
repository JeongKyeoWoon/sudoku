"use client";

import React from "react";
import { cn } from "@/lib/utils/cn.utils";
import {
  BOX_SIZE,
  LEVEL_LIST,
  NUMBERS,
  SUDOKU_GAME_INFO_LOCAL_STORAGE_KEY,
} from "@/constants";
import { ArrowLeft } from "lucide-react";
import { sudokuGen } from "@/lib/utils/sudoku.utils";
import { useFocus } from "@/lib/hooks/useFocus";

export default function Home() {
  /* hooks */
  const { isFocus } = useFocus(false); // 커스텀 포커스 훅

  /* 화면 정보 */
  const [view, setView] = React.useState<TView>("main"); // 노출 화면
  const [isLevelModalOpen, setIsLevelModalOpen] = React.useState(false); // 레벨 선택 모달 노출 여부

  /* 게임 정보 */
  const [level, setLevel] = React.useState<ILevel>(); // 난이도
  const [seconds, setSeconds] = React.useState(0); // 경과시간(초)
  const [mistakeCount, setMistakeCount] = React.useState(0); // 오답 횟수
  const [grid, setGrid] = React.useState<number[][]>(); // 스도쿠 그리드
  const [sudoku, setSudoku] = React.useState<ISudoku>(); // 스도쿠 문제 및 정답
  const [selectedCell, setSelectedCell] = React.useState<{
    row: number;
    col: number;
  }>(); // 선택 셀 정보

  /**
   * 로컬에서 게임 정보 불러오기
   */
  const getGameInfo = React.useCallback(() => {
    const _gameInfo = window.localStorage.getItem(
      SUDOKU_GAME_INFO_LOCAL_STORAGE_KEY
    );

    // 로컬스토리지에 저장된 게임정보가 있다면 세팅
    if (_gameInfo) {
      const gameInfo: IGameInfo = JSON.parse(_gameInfo);

      setLevel(gameInfo.level);
      setSeconds(gameInfo.seconds);
      setMistakeCount(gameInfo.mistakeCount);
      setGrid(gameInfo.grid);
      setSudoku(gameInfo.sudoku);
    }
  }, []);

  /**
   * 게임 시작 - 레벨에 따른 게임 정보 설정 후 게임화면으로 이동한다.
   */
  const startGame = React.useCallback(
    (level: { name: string; deletionsCount: number }) => {
      // 1. 스도쿠 문제 생성
      const { question, solution } = sudokuGen(level.deletionsCount);

      // 2. 게임 상태 초기화
      setLevel(level); // 난이도 세팅
      setSeconds(0); // 경과시간 초기화
      setMistakeCount(0); // 오답 횟수 초기화
      setSudoku({ question, solution }); // 스도쿠 문제, 정답 세팅
      setGrid(question); // 그리드에 문제 세팅
      setSelectedCell(undefined); // 선택 셀 초기화

      // 3. 게임 화면 전환
      setIsLevelModalOpen(false); // 레벨 선택 모달 닫기
      setView("game"); // 게임 화면 전환
    },
    []
  );

  /**
   * 숫자를 클릭하여 그리드에 값 세팅 - 스도쿠 완성 및 오답 체크
   */
  const handleClickNumber = React.useCallback(
    (number: number) => {
      if (
        grid &&
        sudoku &&
        selectedCell &&
        !sudoku.question[selectedCell.row][selectedCell.col]
      ) {
        const _grid = grid.map((v) => [...v]);
        _grid[selectedCell.row][selectedCell.col] = number;

        // 선택 셀에 클릭한 숫자 세팅
        setGrid(_grid);

        // 정답이 아닌 경우 오답 카운트 +1
        if (sudoku.solution[selectedCell.row][selectedCell.col] !== number) {
          setMistakeCount((prev) => prev + 1);
        } else if (JSON.stringify(sudoku.solution) === JSON.stringify(_grid)) {
          alert("complete!");

          // 로컬스토리지 초기화
          window.localStorage.removeItem(SUDOKU_GAME_INFO_LOCAL_STORAGE_KEY);
          // 게임 상태 초기화
          setLevel(undefined);
          setSeconds(0);
          setMistakeCount(0);
          setGrid(undefined);
          setSudoku(undefined);
          setSelectedCell(undefined);
          // 메인으로 이동
          setView("main");
        }
      }
    },
    [grid, sudoku, selectedCell]
  );

  /**
   * 게임화면에서 게임 정보 변동 시 로컬 스토리지에 저장
   */
  React.useEffect(() => {
    // 게임화면일 경우
    if (view === "game") {
      // 게임정보가 존재하면 로컬에 저장
      if (level && grid && sudoku) {
        const gameInfo: IGameInfo = {
          level,
          seconds,
          mistakeCount,
          grid,
          sudoku,
        };

        // 로컬스토리지에 저장
        window.localStorage.setItem(
          SUDOKU_GAME_INFO_LOCAL_STORAGE_KEY,
          JSON.stringify(gameInfo)
        );
      }
      // 존재하지 않는다면 로컬 정보 삭제
      else {
        window.localStorage.removeItem(SUDOKU_GAME_INFO_LOCAL_STORAGE_KEY);
      }
    }
  }, [level, seconds, mistakeCount, grid, sudoku, view]);

  /**
   * 화면 포커싱 시 게임 정보 불러오기 및 경과시간 카운트
   */
  React.useEffect(() => {
    let timer: NodeJS.Timeout;

    // 포커싱 상태일때
    if (isFocus) {
      // 최신 게임 정보 불러오기
      getGameInfo();

      // 게임 화면일 경우 경과 시간 카운트
      if (view === "game") {
        timer = setInterval(() => {
          setSeconds((prev) => prev + 1);
        }, 1000);
      }
    }
    // 포커싱 상태가 아니면서 게임 화면일 경우
    else if (view === "game") {
      // 일시 정지화면 노출 필요
    }

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocus, view]);

  return (
    <main className="text-white bg-default min-h-dvh flex flex-col items-center justify-center relative">
      {/* 메인 섹션 시작 */}
      <section
        className={cn(
          "flex flex-col justify-center items-center gap-12",
          view !== "main" ? "hidden" : ""
        )}
      >
        <h1 className="text-3xl">Sudoku</h1>
        <div className="flex flex-col gap-4">
          <button
            type="button"
            className="rounded-md bg-blue-900 w-40 h-10"
            onClick={() => setIsLevelModalOpen(true)}
          >
            New Game
          </button>

          {sudoku && (
            <>
              <button
                type="button"
                className="rounded-md bg-blue-900 w-40 h-10"
                onClick={() => setView("game")}
              >
                Continue
              </button>
              <p className="flex justify-between px-4">
                <span>{level?.name}</span>
                <span>{seconds}</span>
              </p>
            </>
          )}
        </div>
      </section>
      {/* 메인 섹션 끝 */}

      {/* 새 게임 - 레벨 선택 모달 시작 */}
      <section
        className={cn(
          "w-full h-full absolute flex-col justify-center items-center bg-default",
          isLevelModalOpen ? "flex" : "hidden"
        )}
      >
        <div className="flex flex-col gap-2">
          {/* 레벨 선택 버튼 */}
          {LEVEL_LIST.map((item) => {
            return (
              <button
                type="button"
                key={item.name}
                className="rounded-md bg-blue-900 w-40 h-10"
                onClick={() => startGame(item)}
              >
                {item.name}
              </button>
            );
          })}
          {/* 이전 버튼 */}
          <button
            type="button"
            className="rounded-md bg-orange-600 w-40 h-10 flex justify-center items-center"
            onClick={() => setIsLevelModalOpen(false)}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      </section>
      {/* 새 게임 - 레벨 선택 모달 끝 */}

      {/* 게임 화면 */}
      <section
        className={cn(
          "min-w-60 w-[97%] max-w-[580px] mx-auto",
          view !== "game" ? "hidden" : ""
        )}
      >
        {/* 뒤로가기 버튼 */}
        <button
          type="button"
          className="absolute top-4 left-4"
          onClick={() => setView("main")}
        >
          <ArrowLeft className="w-8 h-8" />
        </button>

        {/* 상단 상태바 */}
        <article className="flex justify-between relative mb-2">
          <span>Mistakes: {mistakeCount}</span>
          <span className="absolute left-1/2 -translate-x-1/2">
            {level?.name}
          </span>
          {seconds}
        </article>

        {/* 스도쿠 보드 */}
        {grid && (
          <div
            className={cn(
              "grid gap-0 border-2 mx-auto border-default grid-cols-9"
            )}
          >
            {grid.map((row, i) => {
              const borderTop =
                i !== 0 && i % BOX_SIZE === 0 ? "border-t-2" : "";
              return row.map((value, j) => {
                const borderLefe =
                  j !== 0 && j % BOX_SIZE === 0 ? "border-l-2" : "";
                // 선택한 셀인지의 여부
                const isSelected =
                  selectedCell &&
                  selectedCell.row === i &&
                  selectedCell.col === j;
                // 선택한 셀과 같은 값인지의 여부
                const isSameValue =
                  value &&
                  !isSelected &&
                  selectedCell &&
                  grid[selectedCell.row][selectedCell.col] === value;
                // 셀의 값이 틀렸을 경우
                const isMistake = value !== sudoku?.solution[i][j];
                // 값이 추가된 경우
                const isAdded = sudoku?.question[i][j] === 0;
                return (
                  <button
                    type="button"
                    key={`${i},${j}`}
                    className={cn(
                      `flex justify-center items-center w-[100%/9] aspect-square border-[0.5px] cursor-pointer border-default/50`,
                      borderTop,
                      borderLefe,
                      isSelected ? "bg-gray-primary" : "",
                      isSameValue ? "bg-green-700/50" : "",
                      isMistake
                        ? "text-red-500"
                        : isAdded
                        ? "text-green-700"
                        : ""
                    )}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedCell(undefined);
                      } else {
                        setSelectedCell({
                          row: i,
                          col: j,
                        });
                      }
                    }}
                  >
                    {!!value && (
                      <span className="text-[6vw] font-medium sm:text-4xl">
                        {value}
                      </span>
                    )}
                  </button>
                );
              });
            })}
          </div>
        )}

        {/* 숫자 목록 */}
        <ul className="mt-4 flex justify-between gap-[2%]">
          {NUMBERS.map((number) => {
            return (
              <li
                key={number}
                className="w-full aspect-[2/3] flex justify-center items-center rounded-md overflow-hidden bg-gray-primary"
              >
                <button
                  type="button"
                  className="w-full h-full flex flex-col justify-center items-center"
                  onClick={() => handleClickNumber(number)}
                >
                  <span className="text-[4vw] font-semibold sm:text-3xl">
                    {number}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
