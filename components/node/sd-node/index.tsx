import React, { useState, useMemo } from "react";
import { NodeProps, useUpdateNodeInternals } from "reactflow";
import { useShallow } from "zustand/react/shallow";

import { NodeImgPreview } from "./node-img-preview";
import { NodeInputs } from "./node-inputs";
import { NodeOutputs } from "./node-outputs";
import { NodeSwappedParams, NodeParams } from "./node-params";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useAppStore } from "@/store";
import { Widget } from "@/types";
import { checkInput, updateNode } from "@/utils";

const SdNodeComponent = ({ id, data: { input, output, output_name }, selected }: NodeProps<Widget>) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const { imagePreviews, inputImgPreviews, nodes, graph } = useAppStore(
    useShallow((st) => ({
      imagePreviews: st.graph?.[id]?.images
        ?.map((image, index) => ({ image, index }))
        .filter(Boolean),
      inputImgPreviews: [
        {
          image: {
            filename: st.onGetNodeFieldsData(id, "image"),
            type: "input",
          },
          index: 0,
        },
      ].filter((i) => i.image.filename),
      nodes: st.nodes,
      graph: st.graph,
    }))
  );

  const [swappedParams, setSwappedParams] = useState<any[]>([]);

  const swapItem = (item: any) => { // swap between params and inputs
    if (swappedParams.find(e => e.name === item.name)) {
      setSwappedParams(p => p.filter(e => e.name !== item.name));
    } else {
      setSwappedParams(p => [...p, item]);
    }
    updateNodeInternals(id);
  }

  const params = useMemo(() => {
    const paramsList: any[] = [];
    Object.entries({...input.required, ...input.optional}).forEach(([property, inputType]) => {
      if (checkInput.isParameterOrList(inputType) && !swappedParams.some(p => p.name === property)) {
        paramsList.push({
          name: property,
          type: inputType[0],
          input: inputType,
        });
      }
    });
    return paramsList;
  }, [input, swappedParams]);

  const inputs = useMemo(() => {
    const makeInputList = (data: Record<string, any> | undefined) => {
      const inputList: any[] = [];
      Object.entries(data ?? []).forEach(([property, inputType]) => {
        if (!checkInput.isParameterOrList(inputType)) {
          inputList.push({ name: property, type: inputType[0] });
        }
      });
      return inputList;
    };
    return {
      required: makeInputList(input.required),
      optional: makeInputList(input.optional),
      // swappedParams:
    };
  }, [input]);

  const outputs = useMemo(() => {
    return output.map((o, i) => ({ name: output_name[i], type: o }));
  }, [output, output_name])

  const { expanded, onExpand } = useAppStore((state) => ({
    expanded: state.expanded,
    onExpand: state.onExpand,
  }));
  // Determine if the current node's accordion should be expanded
  const isExpanded = expanded.includes(id);
  const handleAccordionChange = () => onExpand(id);

  return (
    <>
      <div className="flex items-stretch justify-stretch w-full space-x-6">
        <div className="flex-1">
          <NodeInputs data={inputs} selected={selected} />
          <NodeSwappedParams data={swappedParams} selected={selected} swapItem={swapItem} />
        </div>
        <NodeOutputs data={outputs} selected={selected} />
      </div>
      {params.length > 0 && (
        <Accordion
          type="multiple"
          value={isExpanded ? [id] : []}
          onValueChange={handleAccordionChange}
        >
          <AccordionItem value={id}>
            <AccordionTrigger />
            <AccordionContent className="m-0.5">
              <NodeParams data={params} nodeId={id} selected={selected} swapItem={swapItem} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      <NodeImgPreview data={imagePreviews || inputImgPreviews} />
    </>
  );
};

export const SdNode = React.memo(SdNodeComponent);
