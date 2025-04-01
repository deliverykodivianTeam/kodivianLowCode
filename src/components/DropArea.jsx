import React, { useState } from "react";
import { useDrop } from "react-dnd";

const DropArea = () => {
  const [formElements, setFormElements] = useState([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "FORM_ELEMENT",
    drop: (item) => setFormElements([...formElements, item.name]),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className="flex-1 p-4 border bg-gray-100">
      <h3 className="font-bold mb-2">Drop your form elements here</h3>
      {formElements.map((el, index) => (
        <div key={index} className="p-2 bg-white border rounded mb-2">
          {el}
        </div>
      ))}
    </div>
  );
};

export default DropArea;
