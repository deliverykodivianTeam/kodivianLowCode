import React from "react";
import DraggablePanel from "../components/DraggablePanel";
import DropArea from "../components/DropArea";

const FormBuilder = () => {
  return (
    <div className="flex">
      <DraggablePanel />
      <DropArea />
    </div>
  );
};

export default FormBuilder;
