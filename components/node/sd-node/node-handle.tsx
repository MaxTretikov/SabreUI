import React, { useCallback } from "react";
import { Connection, Handle, HandleType, Position } from "reactflow";
import { isArray, startCase } from "lodash-es";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/store";
import { Slot } from "../style";
import { cn } from "@/lib/utils";

interface NodeHandleProps {
  label: string;
  type: HandleType;
  position: Position;
  slotType?: string;
  isRequired?: boolean;
  selected?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export const NodeHandle = ({
  label,
  type,
  position,
  slotType,
  isRequired,
  selected = false,
  clickable = false,
  onClick,
}: NodeHandleProps) => {
  const nodes = useAppStore(useShallow((state) => state.nodes));

  const handleValidCheck = useCallback(
    (connection: Connection) => {
      if (connection.targetHandle === "*" || connection.sourceHandle === "*")
        return true;
      try {
        let targetType = nodes.find((n) => n.id === connection.target)?.data
          .input.required[String(connection.targetHandle)][0];
        if (isArray(targetType)) targetType = "STRING";
        const sourceType = connection.sourceHandle;
        return targetType === sourceType;
      } catch {
        return true;
      }
    },
    [nodes]
  );

  const positionStyles = {
    left: position === Position.Left ? "-6.5px" : "auto",
    right: position === Position.Right ? "-6.5px" : "auto",
    transform: "translate(0, -30%)",
  };

  return (
    <>
      <Slot 
        position={position} 
        isRequired={isRequired ? 1 : 0} 
        className={cn("group", clickable && "cursor-pointer")} 
        onClick={onClick}
      >
        {isRequired ? (
          <Handle
            id={label}
            type={type}
            position={position}
            isValidConnection={handleValidCheck}
            style={{
              width: "12px",
              height: "12px",
              boxShadow: "0px 0px 12px rgba(72, 66, 66, 0.4)",
              borderColor: selected ? "white" : "#a3a3a3",
              transitionDuration: "200ms",
              ...positionStyles,
            }}
          />
        ) : null}
        <a
          className={cn(
            "mb-1 text-sm text-muted-foreground",
            clickable && "group-hover:underline group-hover:text-white transition duration-200 ease-in-out",
          )}
          title={Array.isArray(slotType) ? "STRING" : slotType}
          onClick={onClick}
        >
          {startCase(label.toLowerCase?.())}
        </a>
      </Slot>
    </>
  );
};
