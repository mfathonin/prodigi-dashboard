"use client";

import { useState } from "react";

const initialNumber = 3;

export const Redirector = ({ link }: { link: string }) => {
  const [counter, setCounter] = useState<number>(initialNumber);
  const [isInitialize, setInitialize] = useState<NodeJS.Timeout>();

  if (counter <= 0) {
    window.location.replace(link);
    isInitialize && clearInterval(isInitialize);
  }

  if (counter === initialNumber && !isInitialize) {
    const intervalId = setInterval(
      () => counter > 0 && setCounter((c) => c - 1),
      1000
    );
    setInitialize(intervalId);
  }

  return (
    <div className="p-4 rounded-md border border-slate-100 dark:border-slate-900">
      Opening{counter ? ` in ${counter}` : ""}...
    </div>
  );
};
