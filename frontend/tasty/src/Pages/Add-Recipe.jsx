import React, {useState, useEffect} from 'react'
import {useHistory} from "react-router-dom"
import authAPI from "../API/auth"
import recipeAPI from "../API/recipes"
import userAPI from "../API/user"
import imageAPI from "../API/image"
const moment = require('moment');

const AddRecipe = () => {
    const [user, setUser] = useState();
    const [pictureFile, setPictureFile] = useState("");
    const [pictureName, setPictureName] = useState("default.png");
    const [steps, setSteps] = useState([""]);
    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState([{ ingredient: "", measurement: "", unit: "none"}]);
    const [timeMin, setTimeMin] = useState();
    const [timeHr, setTimeHr] = useState();
    const [servings, setServings] = useState();
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");
    const [meal, setMeal] = useState("Dinner");
    const [errors, setErrors] = useState({ rating: undefined, title: undefined, servings: undefined, description: undefined, difficulty: undefined, meal: undefined });
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await authAPI.get(`/`);

                setUser(response.data.data);
            } catch (err) {}
        }
        fetchData();
    }, []);

    const uploadPicture = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('picture', pictureFile);

        try {
            const uploadResponse = await imageAPI.post("/upload", formData);

            setPictureName(uploadResponse.data.data);
        } catch (err) {}
    }

    const removePicture = async () => {
        try {
            if (pictureFile !== "default.png") {
                await imageAPI.put('/remove', {picture: pictureName});
                setPictureFile("");
                setPictureName("default.png");
            }
        } catch (err) {}
    }

    const createRecipe = async (e) => {
        e.preventDefault();
        e.target.reset();

        try {
            const ingredientsList = [...ingredients];
            const stepsList = [...steps];

            if (ingredients.length > 1) {
                {ingredients.map((x, i) => {
                    if (x.ingredient === "" && x.measurement === "" && x.unit === "none") {
                        ingredientsList.splice(i, 1);
                        setIngredients(ingredientsList);
                    }
                })}
            }

            if (steps.length > 1) {
                {steps.map((x, i) => {
                    if (x === "") {
                        stepsList.splice(i, 1);
                        setSteps(stepsList);
                    }
                })}
            }
            
            const updateResponse = await recipeAPI.post(`/recipe`, 
            {
                picture: pictureName,
                steps: steps,
                rating: 0,
                title: title,
                ingredients: ingredients,
                reviews: [],
                time: {min: Number(timeMin), hr: Number(timeHr)},
                servings: Number(servings),
                description: description,
                difficulty: difficulty,
                date: moment().format('DD/MM/YYYY'),
                meal: meal,
                creator: user._id
            });

            await userAPI.put(`profile?update=created`, {
                id: updateResponse.data.data
            })

            setPictureName("default.png");
            setSteps([""]);
            setTitle("");
            setIngredients([{ ingredient: "", measurement: "", unit: "none"}]);
            setTimeMin();
            setTimeHr();
            setServings();
            setDescription("");
            setDifficulty("");
            setMeal("");
            setErrors({ rating: undefined, title: undefined, servings: undefined, description: undefined, difficulty: undefined, meal: undefined });

            history.push(`/recipes/${updateResponse.data.data}`);
        } catch (err) {
            setErrors(err.response.data.errors);
        }
    }

    const handleInputIngredients = (e, index) => {
        const list = [...ingredients];
        switch (e.name) {
            case "ingredient":
                list[index].ingredient = e.value;
                setIngredients(list);
                break;
            case "measurement":
                list[index].measurement = e.value;
                setIngredients(list);
                break;
            case "unit":
                list[index].unit = e.value;
                setIngredients(list);
                break;
            default:
                break;
        }
    }
    
    const handleRemoveIngredients = (index) => {
        const list = [...ingredients];
        list.splice(index, 1);
        setIngredients(list);
    };
    
    const handleAddIngredients = () => {
        setIngredients([...ingredients, { ingredient: "", measurement: "", unit: "none" }]);
    };

    const handleInputSteps = (e, index) => {
        const list = [...steps];
        list[index] = e;
        setSteps(list);
    };
    
    const handleRemoveSteps = (index) => {
        const list = [...steps];
        list.splice(index, 1);
        setSteps(list);
    };
    
    const handleAddSteps = () => {
        setSteps([...steps, ""]);
    };

    return (
        <>
            <div className="innerBody">
                <p className="text3">Picture</p>
                <div className="recipeEditPicture">
                    <img src={`http://tasty-env.eba-c5emmwpy.eu-west-2.elasticbeanstalk.com/uploads/${pictureName}`} className="recipeEditDisplayPicture img3" alt="User Avatar" />
                    <form method="POST" onSubmit={uploadPicture} encType="multipart/form-data">
                        <div>
                            <input className="pictureInput" type="file" name="picture" onChange={e => {setPictureFile(e.target.files[0])}} />
                        </div>
                        <div>
                            <input className="pictureUpload text4" type="submit" value="Upload image" />
                            <button type="button" className="pictureRemove text4" onClick={() => {removePicture()}}>Remove image</button>
                        </div>
                    </form>
                </div>
                <form method="POST" onSubmit={createRecipe}>
                    <div>
                        <p className="text3">Title</p>
                        <div className="recipeEditPairRow">
                            <input className="textInputRecipe text5" type="text" name="title" placeholder="Title" maxLength="100" value={title} onChange={e => {setTitle(e.target.value)}} />
                            {errors.title !== undefined && <p className="displayError text5">{errors.title}</p> }
                        </div>
                        <p className="text3">Description</p>
                        <div className="recipeEditPairRow">
                            <textarea className="textareaInput textInputRecipe text5" type="text" name="description" placeholder="Description" maxLength="1000" rows="8" value={description} autoFocus onChange={e => {setDescription(e.target.value)}} />
                            {errors.description !== undefined && <p className="displayError text5">{errors.description}</p> }
                        </div>
                        <div className="recipeEditRow">
                            <div className="recipeEditRowDifficulty">
                                <p className="text3">Difficulty</p>
                                <div className="recipeEditPairRow">
                                    <select className="textInputRecipe text5" name="difficulty" onChange={e => {setDifficulty(e.target.value)}}>
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                    {errors.difficulty !== undefined && <p className="displayError text5">{errors.difficulty}</p> }
                                </div>
                            </div>
                            <div className="recipeEditRowMeal">
                                <p className="text3">Meal type</p>
                                <div className="recipeEditPairRow">   
                                    <select className="textInputRecipe text5" name="meal" onChange={e => {setMeal(e.target.value)}}>
                                        <option value="Dinner">Dinner</option>
                                        <option value="Dessert">Dessert</option>
                                    </select>
                                    {errors.meal !== undefined && <p className="displayError text5">{errors.meal}</p> } 
                                </div>
                            </div>
                            <div className="recipeEditRowServings">
                                <p className="text3">Number of servings</p>
                                <div className="recipeEditPairRow">
                                    <input className="textInputRecipe text5" type="text" name="servings" placeholder="Servings" maxLength="2" value={servings} autoFocus onChange={e => {setServings(e.target.value)}} />
                                    {errors.servings !== undefined && <p className="displayError text5">{errors.servings}</p> }
                                </div>
                            </div>
                        </div>
                        <p className="text3">Cooking time</p>
                        <p className="text5">(Hours, Minutes)</p>
                        <div className="recipeEditPairRow">
                            <input className="textInputRecipe text5" type="text" name="timeHr" placeholder={"Hours"} value={timeHr} autoFocus onChange={e => {setTimeHr(e.target.value)}} />
                            <input className="textInputRecipe text5" type="text" name="timeMin" placeholder={"Minutes"} value={timeMin} onChange={e => {setTimeMin(e.target.value)}} />
                        </div>
                        <p className="text3">Ingredients</p>
                        <p className="text5">(Ingredient, Measurement, Unit)</p>
                        <div className="recipeEditPairRow">
                            <div style={{width: "100%"}}>
                                {ingredients.map((ingredient, i) => {
                                    return (
                                        <div key={i}>
                                            <div className="recipeEditRowIngredients">
                                                <input className="recipeEditRowIngredient textInputRecipe text5" type="text" name="ingredient" placeholder="Ingredient" maxLength="125" value={ingredient.ingredient} onChange={e => handleInputIngredients(e.target, i)} />
                                                <input className="recipeEditRowMeasurement textInputRecipe text5" type="text" name="measurement" placeholder="Measurement" maxLength="5" value={ingredient.measurement} onChange={e => handleInputIngredients(e.target, i)} />
                                                <select className="recipeEditRowUnit textInputRecipe text5" name="unit" onChange={e => handleInputIngredients(e.target, i)}>
                                                    <option value="">none</option>
                                                    <option value="ml">ml</option>
                                                    <option value="l">l</option>
                                                    <option value="g">g</option>
                                                    <option value="kg">kg</option>
                                                    <option value="tbsp">tbsp</option>
                                                    <option value="tsp">tsp</option>
                                                </select>
                                                {ingredients.length !== 1 && <button className="recipeRemoveItem text4" type="button" onClick={() => handleRemoveIngredients(i)}>Remove</button>}
                                            </div>
                                            {ingredients.length - 1 === i && <button className="recipeAddIngredient text4" type="button" onClick={handleAddIngredients}>Add ingredient</button>}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <p className="text3">Steps</p>
                        <div className="recipeEditPairRow">
                            <div style={{width: "100%"}}>   
                                {steps.map((step, i) => {
                                    return (
                                        <div key={i}>
                                            <div className="recipeEditRowSteps">
                                                <textarea className="textareaInput recipeEditRowStep textInputRecipe text5" type="text" name="steps" placeholder="Instruction" maxLength="500" rows="5" value={step} onChange={e => handleInputSteps(e.target.value, i)} />
                                                {steps.length !== 1 && <button className="recipeRemoveItem text4" type="button" onClick={() => handleRemoveSteps(i)}>Remove</button>}
                                            </div>
                                            {steps.length - 1 === i && <button className="recipeAddStep text4" type="button" onClick={handleAddSteps}>Add instruction</button>}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div>
                        <input className="recipeCreate text4" type="submit" value="Create recipe" />
                    </div>
                </form>
            </div>
        </>
    )
}

export default AddRecipe