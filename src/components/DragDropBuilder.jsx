import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

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
        { id: "button", label: "Button", type: "button" },
    ];

    // option adding/remove  for setting menu
    const addOption = (id) => {
        setSettings((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                options: [...(prev[id]?.options || []), ""],
            },
        }));
    };
    const removeOption = (id, index) => {
        setSettings((prev) => {
            const newOptions = [...(prev[id]?.options || [])];
            newOptions.splice(index, 1);
            return { ...prev, [id]: { ...prev[id], options: newOptions } };
        });
    };
    const handleOptionChange = (id, index, value) => {
        setSettings((prev) => {
            const newOptions = [...(prev[id]?.options || [])];
            newOptions[index] = value;
            return { ...prev, [id]: { ...prev[id], options: newOptions } };
        });
    };

    const saveSettings = (id) => {
        // Save the settings and close the settings panel
        setSettings((prev) => ({ ...prev, [id]: { ...prev[id] } }));
        // Close settings panel
    };

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
        setSettings({
            ...settings,
            [newId]: { label: element.label, placeholder: "", required: false, options: [] },
        });
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
        // 1. Generate a unique ID for the form
        const formId = uuidv4();

        // 2. Save the form data to localStorage as a separate entry
        const formData = {
            formElements: formElements,
            settings: settings,
        };
        localStorage.setItem(`savedForm-${formId}`, JSON.stringify(formData));

        // 3. Show a "Form Saved" message (you can replace this with a styled modal)
        alert("Form saved successfully!");

        // 4. Reset the form builder (optional)
        setFormElements([]);
        setSettings({});
    };

    return (
        <div className="drag-drop-container">
            <div className="panel right-panel">
                <h3>Drag Elements</h3>
                {elements.map((el) => (
                    <div
                        key={el.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, el)}
                        className="draggable-item"
                    >
                        {el.label}
                    </div>
                ))}
            </div>
            <div className="panel left-panel" onDrop={handleDrop} onDragOver={handleDragOver}>
                <div></div>
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
                            <button className="settings-button" onClick={() => toggleSettings(el.id)}>
                                ⚙️
                            </button>
                            <button className="delete-button" onClick={() => handleDelete(el.id)}>
                                ❌
                            </button>
                        </div>
                        {activeSettingIndex === el.id && (
                            <div className="settings-panel">
                                <label>
                                    ID: <strong>{el.id}</strong>
                                </label>

                                <input
                                    type="text"
                                    placeholder="Label"
                                    value={settings[el.id]?.label || ""}
                                    onChange={(e) => handleSettingsChange(el.id, "label", e.target.value)}
                                />

                                {["text", "textarea", "number"].includes(el.type) && (
                                    <input
                                        type="text"
                                        placeholder="Placeholder"
                                        value={settings[el.id]?.placeholder || ""}
                                        onChange={(e) => handleSettingsChange(el.id, "placeholder", e.target.value)}
                                    />
                                )}

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={settings[el.id]?.required || false}
                                        onChange={(e) => handleSettingsChange(el.id, "required", e.target.checked)}
                                    />
                                    Required
                                </label>

                                {["select", "checkbox", "radio"].includes(el.type) && (
                                    <div>
                                        <h4>Options</h4>
                                        {settings[el.id]?.options?.map((opt, idx) => (
                                            <div key={idx} className="option-item">
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(el.id, idx, e.target.value)}
                                                />
                                                <button onClick={() => removeOption(el.id, idx)}>
                                                    ❌
                                                </button>
                                            </div>
                                        ))}
                                        <button className="add-settings" onClick={() => addOption(el.id)}>
                                            ➕
                                        </button>
                                    </div>
                                )}
                                {/* Save Button */}
                                <button className="save-settings" onClick={() => saveSettings(el.id)}>
                                    {" "}
                                    Save
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                {formElements.length > 0 && (
                    <button className="proceed-button" onClick={handleProceed}>
                        Proceed
                    </button>
                )}
            </div>
        </div>
    );
};
export default DragDropBuilder;