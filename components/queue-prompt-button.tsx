"use client";

import { PlayIcon } from "@radix-ui/react-icons";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useAppStore } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const QueuePromptButton = () => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const { onSubmit, queue, onDeleteFromQueue, promptError, onEdgesAnimate } =
    useAppStore(
      useShallow((state) => ({
        onSubmit: state.onSubmit,
        queue: state.queue,
        onDeleteFromQueue: state.onDeleteFromQueue,
        promptError: state.promptError,
        onEdgesAnimate: state.onEdgesAnimate,
      }))
    );

  useEffect(() => {
    if (promptError !== undefined) {
      toast.error(promptError);
    }
  }, [promptError, count]);

  useEffect(() => {
    onEdgesAnimate(queue.length > 0);
  }, [queue, onEdgesAnimate]);

  const handleRun = useCallback(() => {
    setLoading(true);
    onSubmit();
    setCount((prevCount) => prevCount + 1);
  }, [onSubmit]);

  const queueHasItems = queue.length > 0;

  return (
    <Tooltip>
      {/* TODO: Fix MultiStepLoader */}
      {/* <Loader loadingStates={nodes} loading={loading} /> */}

      <TooltipTrigger>
        <Button
          className={cn(
            "relative h-12 w-12 rounded-3xl shadow-lg bg-gradient-to-b text-white dark:text-black dark:from-white dark:to-blue-50 ring-2 ring-blue-50 ring-opacity-60",
            "from-slate-800 to-slate-700 ring-slate-400",
            "hover:rounded-lg transition-all duration-200"
          )}
          onClick={handleRun}
        >
          <PlayIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left" className="text-xs">
        Queue prompt
      </TooltipContent>
    </Tooltip>
  );
};
