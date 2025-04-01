import React, { useState, useEffect } from "react";
const Dashboard = () => {
    const [savedForms, setSavedForms] = useState([]);
    const [editingFormId, setEditingFormId] = useState(null);
    const [editedFormData, setEditedFormData] = useState(null);

    useEffect(() => {
        // 1. Retrieve all saved forms from localStorage
        const forms = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("savedForm-")) {
                const formData = localStorage.getItem(key);
                if (formData) {
                    forms.push({ id: key.replace("savedForm-", ""), ...JSON.parse(formData) });
                }
            }
        }
        setSavedForms(forms);
    }, []);

    const handleDeleteForm = (id) => {
        localStorage.removeItem(`savedForm-${id}`);
        setSavedForms(savedForms.filter((form) => form.id !== id));
    };

    const handleEditForm = (id) => {
        setEditingFormId(id);
        const formToEdit = savedForms.find((form) => form.id === id);
        if (formToEdit) {
            setEditedFormData(formToEdit);
        }
    };

    const handleSaveEdit = (id, editedData) => {
        localStorage.setItem(`savedForm-${id}`, JSON.stringify(editedData));
        setSavedForms(savedForms.map(form => form.id === id ? { id, ...editedData } : form));
        setEditingFormId(null);
        setEditedFormData(null);
    };

    const renderFormCard = (form) => {
        return (
            <div key={form.id} className="form-card">
                <h3>Form</h3>
                <form>
                    {form.formElements.map((el) => {
                        const setting = form.settings[el.id] || {};
                        if (["text", "number", "date", "file"].includes(el.type)) {
                            return (
                                <div key={el.id}>
                                    <label>{setting.label || el.label}:</label>
                                    <input
                                        type={el.type}
                                        placeholder={setting.placeholder || ""}
                                        required={setting.required}
                                        defaultValue={editedFormData?.settings[el.id]?.value || ""}
                                        onChange={(e) => handleEditInputChange(el.id, "value", e.target.value)}
                                    />
                                </div>
                            );
                        } else if (el.type === "textarea") {
                            return (
                                <div key={el.id}>
                                    <label>{setting.label || el.label}:</label>
                                    <textarea
                                        placeholder={setting.placeholder || ""}
                                        required={setting.required}
                                        defaultValue={editedFormData?.settings[el.id]?.value || ""}
                                        onChange={(e) => handleEditInputChange(el.id, "value", e.target.value)}
                                    />
                                </div>
                            );
                        } else if (el.type === "select") {
                            return (
                                <div key={el.id}>
                                    <label>{setting.label || el.label}:</label>
                                    <select
                                        defaultValue={editedFormData?.settings[el.id]?.value || ""}
                                        onChange={(e) => handleEditInputChange(el.id, "value", e.target.value)}
                                    >
                                        {setting.options &&
                                            setting.options.map((opt, index) => (
                                                <option key={index} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            );
                        } else if (el.type === "checkbox" || el.type === "radio") {
                            return (
                                <div key={el.id}>
                                    <label>{setting.label || el.label}:</label>
                                    {setting.options &&
                                        setting.options.map((opt, index) => (
                                            <label key={index}>
                                                <input
                                                    type={el.type}
                                                    name={el.id}
                                                    value={opt}
                                                    required={setting.required}
                                                    defaultChecked={editedFormData?.settings[el.id]?.value === opt}
                                                    onChange={(e) => handleEditCheckboxChange(el.id, opt, e.target.checked)}
                                                />{" "}
                                                {opt}
                                            </label>
                                        ))}
                                </div>
                            );
                        }
                        return null; // Handle other element types if needed
                    })}
                    {editingFormId === form.id ? (
                        <button type="button" onClick={() => handleSaveEdit(form.id, editedFormData)}>
                            Save Edit
                        </button>
                    ) : null}
                </form>
                <div className="form-actions">
                    <button onClick={() => handleDeleteForm(form.id)}>Delete</button>
                    <button onClick={() => handleEditForm(form.id)}>Edit</button>
                </div>
            </div>
        );
    };

    const handleEditInputChange = (id, field, value) => {
        setEditedFormData(prevData => ({
            ...prevData,
            settings: {
                ...prevData?.settings,
                [id]: {
                    ...prevData?.settings[id],
                    [field]: value,
                },
            },
        }));
    };

    const handleEditCheckboxChange = (id, option, checked) => {
        setEditedFormData(prevData => {
            const newSettings = { ...prevData?.settings };
            if (!newSettings[id]) {
                newSettings[id] = {};
            }
            newSettings[id].value = checked ? option : "";
            return {
                ...prevData,
                settings: newSettings,
            };
        });
    };

    return (
        <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="form-grid">
                {savedForms.length > 0 ? (
                    savedForms.map(renderFormCard)
                ) : (
                    <p>No forms have been created yet.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;