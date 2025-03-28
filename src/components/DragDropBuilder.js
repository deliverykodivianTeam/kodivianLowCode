import React, { useState } from "react";
const DragDropBuilder = () => {
  const [formElements, setFormElements] = useState([]);
  const [settings, setSettings] = useState({});
  const [activeSettingIndex, setActiveSettingIndex] = useState(null);
  const elements = [
    { id: "header", label: "Header", type: "header" },
    { id: "text", label: "Text Input", type: "text" },
    { id: "textarea", label: "Textarea", type: "textarea" },
    { id: "number", label: "Number", type: "number" },
    { id: "date", label: "Date", type: "date" },
    { id: "select", label: "Dropdown", type: "select" },
    { id: "checkbox", label: "Checkbox", type: "checkbox" },
    { id: "radio", label: "Radio Button", type: "radio" },
    { id: "file", label: "File Upload", type: "file" },
    { id: "button", label: "Submit Button", type: "button" }
  ];
  const handleDragStart = (e, element) => {
    e.dataTransfer.setData("element", JSON.stringify(element));
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("element");
    if (!data) return;
    const element = JSON.parse(data);
    const newId = `field-${Date.now()}`;
    setFormElements([...formElements, { ...element, id: newId }]);
    setSettings({ ...settings, [newId]: { label: element.label, placeholder: "", required: false, options: [] } });
  };
  const handleDragStartDropped = (e, index) => {
    e.dataTransfer.setData("draggedIndex", index);
  };
  
  const handleDropReorder = (e, targetIndex) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData("draggedIndex");
    if (draggedIndex === "") return;
  
    const newElements = [...formElements];
    const [movedElement] = newElements.splice(draggedIndex, 1);
    newElements.splice(targetIndex, 0, movedElement);
  
    setFormElements(newElements);
  };  

  const handleDragOver = (e) => e.preventDefault();
  const handleDelete = (id) => {
    setFormElements(formElements.filter((el) => el.id !== id));
    setSettings((prevSettings) => {
      const newSettings = { ...prevSettings };
      delete newSettings[id];
      return newSettings;
    });
  };
  const handleSettingsChange = (id, field, value) => {
    setSettings({ ...settings, [id]: { ...settings[id], [field]: value } });
  };
  const toggleSettings = (id) => {
    setActiveSettingIndex(activeSettingIndex === id ? null : id);
  };
  const handleProceed = () => {
    const newWindow = window.open("", "_blank");
    if (!newWindow) {
      alert("Popup blocked! Please allow popups for this site.");
      return;
    }
  
    newWindow.document.write(`
      <html>
        <head>
          <title>Generated Form</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f9; }
            .form-container { max-width: 400px; margin: auto; padding: 20px; background: white; border-radius: 10px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); }
            .form-container label { font-weight: bold; display: block; margin-top: 10px; }
            .form-container input, .form-container select, .form-container textarea { 
              width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 5px; 
            }
            .form-container button { 
              margin-top: 15px; padding: 10px 20px; background-color: green; color: white; 
              border: none; border-radius: 5px; cursor: pointer; 
            }
          </style>
        </head>
        <body>
          <div class="form-container">
            <h2>Generated Form</h2>
            <form>
    `);
  
    formElements.forEach((el) => {
      const setting = settings[el.id] || {};
      newWindow.document.write(`<label>${setting.label || el.label}:</label>`);
  
      if (el.type === "text" || el.type === "number" || el.type === "date" || el.type === "file") {
        newWindow.document.write(
          `<input type="${el.type}" placeholder="${setting.placeholder || ""}" ${setting.required ? "required" : ""}>`
        );
      } else if (el.type === "textarea") {
        newWindow.document.write(
          `<textarea placeholder="${setting.placeholder || ""}" ${setting.required ? "required" : ""}></textarea>`
        );
      } else if (el.type === "select") {
        newWindow.document.write("<select>");
        (setting.options || []).forEach((opt) => {
          newWindow.document.write(`<option>${opt}</option>`);
        });
        newWindow.document.write("</select>");
      } else if (el.type === "checkbox" || el.type === "radio") {
        newWindow.document.write(
          `<input type="${el.type}" ${setting.required ? "required" : ""}> ${setting.label || el.label}`
        );
      }
    });
  
    newWindow.document.write(`
            <button type="submit">Submit</button>
          </form>
        </div>
      </body>
    </html>
    `);
  
    newWindow.document.close();
  };
  
  return (
    <div className="drag-drop-container">
      <div className="panel right-panel">
        <h3>Drag Elements</h3>
        {elements.map((el) => (
          <div key={el.id} draggable onDragStart={(e) => handleDragStart(e, el)} className="draggable-item">
            {el.label}
          </div>
        ))}
      </div>
      <div className="panel left-panel" onDrop={handleDrop} onDragOver={handleDragOver}>
        <h3>Drop Here</h3>
        {formElements.map((el, index) => (
  <div
    key={el.id}
    className="form-element"
    draggable
    onDragStart={(e) => handleDragStartDropped(e, index)}
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => handleDropReorder(e, index)}
  >
    {el.label}
    <div className="button-group">
      <button className="settings-button" onClick={() => toggleSettings(el.id)}>⚙️</button>
      <button className="delete-button" onClick={() => handleDelete(el.id)}>❌</button>
    </div>
    {activeSettingIndex === el.id && (
      <div className="settings-panel">
        <input
          type="text"
          placeholder="Label"
          value={settings[el.id]?.label}
          onChange={(e) => handleSettingsChange(el.id, "label", e.target.value)}
        />
        <input
          type="text"
          placeholder="Placeholder"
          value={settings[el.id]?.placeholder}
          onChange={(e) => handleSettingsChange(el.id, "placeholder", e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={settings[el.id]?.required}
            onChange={(e) => handleSettingsChange(el.id, "required", e.target.checked)}
          />
          Required
        </label>
      </div>
    )}
  </div>
))}
       {formElements.length > 0 && <button className="proceed-button" onClick={handleProceed}>Proceed</button>}

      </div>
    </div>
  );
};
export default DragDropBuilder;