"use client";

import React from "react";
import { cn } from "@/lib/utils/cn.utils";
import { LEVEL_LIST } from "@/constants";
import { ArrowLeft } from "lucide-react";
import { sudokuGen } from "@/lib/utils/sudoku.utils";

export default function Home() {
  const [view, setView] = React.useState<TView>("main"); // 노출 화면
  const [isLevelModalOpen, setIsLevelModalOpen] = React.useState(false); // 레벨 선택 모달 노출 여부

  /* 게임 정보 */
  const [level, setLevel] = React.useState<ILevel>(); // 난이도
  const [seconds, setSeconds] = React.useState(0); // 경과시간(초)
  const [mistakeCount, setMistakeCount] = React.useState(0); // 오답 횟수
  const [grid, setGrid] = React.useState<number[][]>(); // 스도쿠 그리드
  const [sudoku, setSudoku] = React.useState<ISudoku>(); // 스도쿠 문제 및 정답

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

      // 3. 게임 화면 전환
      setIsLevelModalOpen(false); // 레벨 선택 모달 닫기
      setView("game"); // 게임 화면 전환
    },
    []
  );
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
      <section className={cn(view !== "game" ? "hidden" : "")}>
        <button
          type="button"
          className="absolute top-4 left-4"
          onClick={() => setView("main")}
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
      </section>
    </main>
  );
}
