import { useEffect, useState } from "react";
import { connectedBy, operator } from "../../constants";
import { propertyImportFromDB } from "../../lib/propertyImportFromDB";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CreateRule = () => {

    const [ruleFormData, setRuleFormData] = useState({
        name: '',
        description: "",
        tested: false,
        conditionSchema: [
            {
                property: '',
                operator: '',
                value: '',
                connectedBy: '',
                conditionSchema: []
            }
        ],
        actionSchema: [
            {
                property: '',
                result: '',
                connectedBy: '',
                actionSchema: []
            }
        ]
    });

    const addFieldsConditionSchema = () => {
        setRuleFormData(prevState => ({
            ...prevState,
            conditionSchema: [
                ...prevState.conditionSchema,
                {
                    property: '',
                    operator: '',
                    value: '',
                    connectedBy: '',
                    conditionSchema: []
                }
            ]
        }));
    };

    const addFieldsActionSchema = () => {
        setRuleFormData(prevState => ({
            ...prevState,
            actionSchema: [
                ...prevState.actionSchema,
                {
                    property: '',
                    result: '',
                    connectedBy: '',
                    actionSchema: []
                }
            ]
        }));
    };

    const [property, setProperty] = useState([])
    // get property from db
    const propertyFromDB = async () => {
        const property = await propertyImportFromDB()
        setProperty(property)
        console.log(property)
    }

    useEffect(() => {
        propertyFromDB()
    }, [])
    // const handleConditionChange = (index, field, value) => {
    //     setRuleFormData(prevState => ({
    //         ...prevState,
    //         conditionSchema: prevState.conditionSchema.map((item, i) => {
    //             if (i === index) {
    //                 return { ...item, [field]: value };
    //             }
    //             return item;
    //         })
    //     }));
    // };

    // const handleSchemaChange = (schemaType, index, field, value) => {
    //     setRuleFormData(prevState => ({
    //         ...prevState,
    //         [schemaType]: prevState[schemaType].map((item, i) => {
    //             if (i === index) {
    //                 return { ...item, [field]: value };
    //             }
    //             return item;
    //         })
    //     }));
    // };

    const handleSchemaChange = (schemaType, index, field, value) => {
        setRuleFormData(prevState => ({
            ...prevState,
            [schemaType]: prevState[schemaType].map((item, i) => {
                if (i === index) {
                    return { ...item, [field]: value };
                }
                return item;
            })
        }));
    };
    const showToastMessage = () => {
        toast.success("Rule Added Sucessfully", {
            position: toast.POSITION.TOP_RIGHT,
        });
    }
    const showToastErrorMessage = () => {
        toast.error("Rule Creation Failed! Try Again.", {
            position: toast.POSITION.TOP_RIGHT,
        });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        console.log(ruleFormData);
        // submitting the form to api using fetch
        try {
            const response = await fetch('http://localhost:5002/rules/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ruleFormData)
            });

            console.log(response);
            if (response.ok) {
                showToastMessage()
            } else {
                showToastErrorMessage()
            }
        } catch (err) {
            console.log(err);
            toast({
                variant: "destructive",
                message: "Rule creation failed, try again",
                type: "error",
            })
        }
    };

    return (
        <section>
            <form onSubmit={submitHandler}>
                <div className="w-full flex gap-4">

                    <div>
                        <label htmlFor="name">Name</label>
                        <br />
                        <input type="text" id="name" className="border-2 input-styles " name="name" value={ruleFormData.name} onChange={(e) => setRuleFormData({ ...ruleFormData, name: e.target.value })} />
                    </div>
                    <div>

                        <label htmlFor="description">Description</label>
                        <br />
                        <input type="text" id="description" className="border-2 w-[30vw] input-styles" name="description" value={ruleFormData.description} onChange={(e) => setRuleFormData({ ...ruleFormData, description: e.target.value })} />
                    </div>
                    <div className="w-1/3">
                        <label htmlFor="tested">Tested</label>
                        <br />
                        <input type="checkbox" id="tested" name="tested" checked={ruleFormData.tested} onChange={(e) => setRuleFormData({ ...ruleFormData, tested: e.target.checked })} />
                    </div>
                </div>

                <h1 className="text-xl font-bold">Rules</h1>
                {/* dynamic form */}
                {ruleFormData.conditionSchema.map((item, index) => (
                    <div key={index} className="w-full flex gap-4 justify-center items-end border-2">
                        <div className="w-1/4 border-2">
                            <label htmlFor={`property-${index}`}>Property</label>
                            <br />
                            <select className="input-styles w-full" name={`property-${index}`} id={`operator-${index}`} onChange={(e) => handleSchemaChange("conditionSchema", index, 'property', e.target.value)}>
                                {property.map((op, index) => {
                                    return (
                                        <option key={index} value={op.value}>{op.name}</option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="w-1/4">
                            <label htmlFor={`operator-${index}`}>Operator</label>
                            <br />
                            <select className="input-styles w-full" name={`operator-${index}`} id={`operator-${index}`} onChange={(e) => handleSchemaChange("conditionSchema", index, 'operator', e.target.value)}>
                                {operator.map((op, index) => {
                                    return (
                                        <option key={index} value={op.value}>{op.name}</option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="w-1/4">
                            <label htmlFor={`value-${index}`}>Value</label>
                            <br />
                            <input className="input-styles w-full" type="text" id={`value-${index}`} name={`value-${index}`} value={item.value} onChange={(e) => handleSchemaChange("conditionSchema", index, 'value', e.target.value)} />

                        </div>

                        <div className="w-1/4">
                            <label htmlFor={`connectedBy-${index}`}>Connected By</label>
                            <br />
                            {/* <input type="text" id={`connectedBy-${index}`} className="border-2 input-styles w-full" name={`connectedBy-${index}`} value={item.connectedBy} onChange={(e) => handleSchemaChange("conditionSchema", index, 'connectedBy', e.target.value)} /> */}
                            <select className="input-styles w-full" name={`connectedBy-${index}`} id={`connectedBy-${index}`} onChange={(e) => handleSchemaChange("conditionSchema", index, 'connectedBy', e.target.value)}>
                                {connectedBy.map((op, index) => {
                                    return (
                                        <option key={index} value={op.value}>{op.name}</option>
                                    );
                                })}
                            </select>
                        </div>
                        <Button type="button" onClick={addFieldsConditionSchema} className=" text-white">Add Fields +</Button>
                        <Button type="button" disabled variant="destructive" onClick={addFieldsConditionSchema} className=" text-white">Delete Fields </Button>

                        {/* button for nesting conditions */}
                        <Button disabled type="button">Combine conditions</Button>
                    </div>
                ))}
                <br />
                <br />
                <br />

                <h1 className="text-xl font-bold">Actions</h1>

                {/* for action schema */}
                {ruleFormData.actionSchema.map((item, index) => {
                    return (
                        <div key={index} className="w-full flex gap-4 justify-center items-end border-2">
                            <div className="w-1/3">
                                <label htmlFor={`property-${index}`}>Property</label>
                                <br />
                                {/* <input type="text" id={`property-${index}`} className="border-2 input-styles w-full" name={`property-${index}`} value={item.property} onChange={(e) => handleSchemaChange("actionSchema", index, 'property', e.target.value)} /> */}
                                <select className="input-styles w-full" name={`property-${index}`} id={`operator-${index}`} onChange={(e) => handleSchemaChange("actionSchema", index, 'property', e.target.value)}>
                                    {property.map((op, index) => {
                                        return (
                                            <option key={index} value={op.value}>{op.name}</option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label htmlFor={`result-${index}`}>Result</label>
                                <br />
                                <input type="text" id={`result-${index}`} className="border-2 input-styles w-full" name={`result-${index}`} value={item.result} onChange={(e) => handleSchemaChange("actionSchema", index, 'result', e.target.value)} />
                            </div>
                            <div className="w-1/3">
                                <label htmlFor={`connectedBy-${index}`}>Connected By</label>
                                <br />

                                <select className="input-styles w-full" name={`connectedBy-${index}`} id={`connectedBy-${index}`} onChange={(e) => handleSchemaChange("actionSchema", index, 'connectedBy', e.target.value)}>
                                    {connectedBy.map((op, index) => {
                                        return (
                                            <option key={index} value={op.value}>{op.name}</option>
                                        );
                                    })}
                                </select>
                            </div>

                            <Button type="button" onClick={addFieldsActionSchema} className=" text-white">Add Fields +</Button>

                            {/* button for nesting actions */}
                            <Button disabled type="button">Combine actions</Button>
                        </div>
                    )
                })}


                <br />
                <br />
                <Button type="submit" className="border-2">Create Rule</Button>
            </form>
            <ToastContainer />
        </section>
    );
}

export default CreateRule;
