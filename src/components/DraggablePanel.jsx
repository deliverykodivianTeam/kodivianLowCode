import React from "react";
import { useDrag } from "react-dnd";

const elements = [
  "Heading", "Text", "Textarea", "Number", "Date", "Dropdown",
  "Checkbox", "Radio", "Table", "File"
];

const DraggablePanel = () => {
  return (
    <div className="w-64 bg-gray-200 p-4">
      <h3 className="font-bold mb-2">Elements</h3>
      {elements.map((item) => (
        <DraggableElement key={item} name={item} />
      ))}
    </div>
  );
};

const DraggableElement = ({ name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FORM_ELEMENT",
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className="p-2 bg-white border rounded cursor-pointer mb-2">
      {name}
    </div>
  );
};

export default DraggablePanel;
