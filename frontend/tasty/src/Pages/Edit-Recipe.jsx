import React, {useState, useEffect} from 'react'
import {Link, useParams, useHistory} from "react-router-dom"
import recipeAPI from "../API/recipes"
import imageAPI from "../API/image"

const EditRecipe = () => {
    const [recipe, setRecipe] = useState();
    const [pictureFile, setPictureFile] = useState("");
    const [pictureName, setPictureName] = useState("");
    const [steps, setSteps] = useState([""]);
    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState([{ ingredient: "", measurement: "", unit: ""}]);
    const [timeMin, setTimeMin] = useState("");
    const [timeHr, setTimeHr] = useState("");
    const [servings, setServings] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [meal, setMeal] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [editPicture, setEditPicture] = useState(false);
    const [editSteps, setEditSteps] = useState(false);
    const [editTitle, setEditTitle] = useState(false);
    const [editIngredients, setEditIngredients] = useState(false);
    const [editTime, setEditTime] = useState(false);
    const [editServings, setEditServings] = useState(false);
    const [editDescription, setEditDescription] = useState(false);
    const [editDifficulty, setEditDifficulty] = useState(false);
    const [editMeal, setEditMeal] = useState(false);
    const [errors, setErrors] = useState({ rating: undefined, title: undefined, servings: undefined, description: undefined, difficulty: undefined, meal: undefined });
    const recipeID = useParams().id;
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await recipeAPI.get(`/recipe/${recipeID}`);

                setRecipe(response.data.data.recipe);
                setLoaded(true);
            } catch (err) {}
        }
        fetchData();
    }, [recipeID]);

    useEffect(() => {
        if (loaded) {
            if (recipe.ingredients.length === 0) {
                setIngredients([{ ingredient: "", measurement: "", unit: ""}]);
            } else {
                setIngredients(recipe.ingredients);
            }

            if (recipe.steps.length === 0) {
                setSteps([""]);
            } else {
                setSteps(recipe.steps);
            }

            setPictureName(recipe.picture);
            setTitle(recipe.title);
            setTimeMin(recipe.time.min);
            setTimeHr(recipe.time.hr);
            setServings(recipe.servings);
            setDescription(recipe.description);
            setDifficulty(recipe.difficulty);
            setMeal(recipe.meal);
        }
    }, [loaded]);

    const uploadPicture = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('picture', pictureFile);

            const uploadResponse = await imageAPI.post("/upload", formData);

            setPictureName(uploadResponse.data.data);
        } catch (err) {}
    }

    const removePicture = async () => {
        try {
            if (pictureFile !== "" && recipe.picture !== "default.png") {
                await imageAPI.put('/remove', {picture: recipe.picture});
                setPictureFile("");
                setPictureName(recipe.picture);
            }
        } catch (err) {}
    }

    const updateRecipe = async (e) => {
        e.preventDefault();
        e.target.reset();

        try {
            const ingredientsList = [...ingredients];
            const stepsList = [...steps];

            if (pictureName !== recipe.picture) {
                await imageAPI.put('/remove', {picture: recipe.picture});
            }

            {ingredients.map((x, i) => {
                if (x.ingredient === "" && x.measurement === "" && x.unit === "") {
                    ingredientsList.splice(i, 1);
                    setIngredients(ingredientsList);
                }
            })}

            {steps.map((x, i) => {
                if (x === "") {
                    stepsList.splice(i, 1);
                    setSteps(stepsList);
                }
            })}

            await recipeAPI.put(`/recipe/${recipeID}?update=all`, 
            {
                picture: pictureName,
                steps: steps,
                title: title,
                ingredients: ingredients,
                time: {min: timeMin, hr: timeHr},
                servings: servings,
                description: description,
                difficulty: difficulty,
                meal: meal
            });

            setEditPicture(false);
            setEditSteps(false);
            setEditTitle(false);
            setEditIngredients(false);
            setEditTime(false);
            setEditServings(false);
            setEditDescription(false);
            setEditDifficulty(false);
            setEditMeal(false);

            history.push(`/recipes/${recipeID}`)
        } catch (err) {
            setErrors(err.response.data.errors);
        }
    }

    const handleInputIngredients = (e, index) => {
        const list = [...ingredients];
        switch (e.name) {
            case "ingredient":
                list[index].ingredient = e.value;
                break;
            case "measurement":
                list[index].measurement = e.value;
                break;
            case "unit":
                list[index].unit = e.value;
                break;
            default:
                break;
        }
        setIngredients(list);
    }

    const handleRemoveIngredients = (index) => {
        const list = [...ingredients];
        list.splice(index, 1);
        setIngredients(list);
    }
    
    const handleAddIngredients = () => {
        setIngredients([...ingredients, { ingredient: "", measurement: "", unit: "" }]);
    }

    const handleInputSteps = (e, index) => {
        const list = [...steps];
        list[index] = e;
        setSteps(list);
    }
    
    const handleRemoveSteps = (index) => {
        const list = [...steps];
        list.splice(index, 1);
        setSteps(list);
    }
    
    const handleAddSteps = () => {
        setSteps([...steps, ""]);
    }

    const cancelEdit = (input) => {
        switch (input) {
            case "picture":
                removePicture();
                setPictureName(recipe.picture);
                setEditPicture(false);
                break;
            case "title":
                setTitle(recipe.title);
                setEditTitle(false);
                break;
            case "description":
                setDescription(recipe.description);
                setEditDescription(false);
                break;
            case "difficulty":
                setDifficulty(recipe.difficulty);
                setEditDifficulty(false);
                break;
            case "time":
                setTimeMin(recipe.time.min);
                setTimeHr(recipe.time.hr);
                setEditTime(false);
                break;
            case "servings":
                setServings(recipe.servings);
                setEditServings(false);
                break;
            case "meal":
                setTimeMin(recipe.meal);
                setEditMeal(false);
                break;
            case "ingredients":
                if (recipe.ingredients.length === 0) {
                    setIngredients([{ ingredient: "", measurement: "", unit: ""}]);
                } else {
                    setIngredients(recipe.ingredients);
                }
                setEditIngredients(false);
                break;
            case "steps":
                if (recipe.steps.length === 0) {
                    setSteps([""]);
                } else {
                    setSteps(recipe.steps);
                }
                setEditSteps(false);
                break;
            default:
                break;
        }
    }

    const displayTime = () => {
        if (timeMin !== "" && timeHr !== "") {
            return `${timeHr}hr ${timeMin}mins`;
        } else if (timeMin === "" && timeHr !== "") {
            return `${timeHr}hr 0min`;
        } else if (timeMin !== "" && timeHr === "") {
            return `0hr ${timeMin}mins`;
        }
    }

    return (
        <>
            {loaded ?
                <div className="innerBody">
                    <p className="text3">Picture</p>
                    {editPicture ?
                        <div className="recipeEditPicture">
                            <img src={`http://localhost:5000/uploads/${pictureName}`} className="img3" alt="User Avatar" />
                            <form method="POST" onSubmit={uploadPicture} encType="multipart/form-data">
                                <div>
                                    <input className="pictureInput" type="file" name="picture" onChange={e => {setPictureFile(e.target.files[0])}} />
                                </div>
                                <div>
                                    <input className="pictureUpload text4" type="submit" value="Upload image" />
                                    <button type="button" className="pictureRemove text4" onClick={() => {removePicture()}}>Remove image</button>
                                </div>
                            </form>
                            <button className="recipePictureCancel text4" type="button" onClick={() => {cancelEdit("picture")}}>Cancel</button>
                        </div>
                    :
                        <div className="recipeEditPairRow">
                            <img src={`http://localhost:5000/uploads/${pictureName}`} className="img3" style={{marginRight: 15}} alt="User Avatar" />
                            <button className="recipeEdit text4" type="button" onClick={() => {setEditPicture(true)}}>Edit</button>
                        </div>
                    }
                    <form style={{marginTop: 50}} method="PUT" onSubmit={updateRecipe}>
                        <div>
                            <p className="text3">Title</p>
                            {editTitle ?
                                <div className="recipeEditPairRow">
                                    <input className="textInputRecipe text5" type="text" name="title" placeholder="Title" maxLength="100" value={title} autoFocus onChange={e => {setTitle(e.target.value)}} />
                                    {errors.title && <p className="displayError text5">{errors.title}</p> }
                                    <button className="recipeCancel text4" type="button" onClick={() => {cancelEdit("title")}}>Cancel</button>
                                </div>
                            :
                                <div className="recipeEditPairRow">
                                    <p className="textDisplayRecipe text5">{title}</p>
                                    <button className="recipeEdit text4" type="button" onClick={() => {setEditTitle(true)}}>Edit</button>
                                </div>
                            }
                            <p className="text3">Description</p>
                            {editDescription ?
                                <div className="recipeEditPairRow">
                                    <textarea className="textareaInput textInputRecipe text5" type="text" name="description" placeholder="Description" maxLength="1000" rows="8" value={description} autoFocus onChange={e => {setDescription(e.target.value)}} />
                                    {errors.description && <p className="displayError text5">{errors.description}</p> }
                                    <button className="recipeCancel text4" type="button" onClick={() => {cancelEdit("description")}}>Cancel</button>
                                </div>
                            :
                                <div className="recipeEditPairRow">
                                    <p className="textDisplayRecipe text5">{description}</p>
                                    <button className="recipeEdit text4" type="button" onClick={() => {setEditDescription(true)}}>Edit</button>
                                </div>
                            }
                            <div className="recipeEditRow">
                                <div className="recipeEditRowDifficulty">
                                    <p className="text3">Difficulty</p>
                                    {editDifficulty ?
                                        <div className="recipeEditPairRow">
                                            <select className="textInputRecipe text5" name="difficulty" onChange={e => {setDifficulty(e.target.value)}}>
                                                <option value="Easy">Easy</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Hard">Hard</option>
                                            </select>
                                            {errors.difficulty && <p className="displayError text5">{errors.difficulty}</p> }
                                            <button className="recipeCancel text4" type="button" onClick={() => {cancelEdit("difficulty")}}>Cancel</button>
                                        </div>
                                    :
                                        <div className="recipeEditPairRow">
                                            <p className="textDisplayRecipe text5">{difficulty}</p>
                                            <button className="recipeEdit text4" type="button" onClick={() => {setEditDifficulty(true)}}>Edit</button>
                                        </div>
                                    }
                                </div>
                                <div className="recipeEditRowMeal">
                                    <p className="text3">Meal type</p>
                                    {editMeal ?
                                        <div className="recipeEditPairRow">   
                                            <select className="textInputRecipe text5" name="meal" onChange={e => {setMeal(e.target.value)}}>
                                                <option value="Dinner">Dinner</option>
                                                <option value="Dessert">Dessert</option>
                                            </select>
                                            {errors.meal && <p className="displayError text5">{errors.meal}</p> } 
                                            <button className="recipeCancel text4" type="button" onClick={() => {cancelEdit("meal")}}>Cancel</button>
                                        </div>
                                    :
                                        <div className="recipeEditPairRow">
                                            <p className="textDisplayRecipe text5">{meal}</p>
                                            <button className="recipeEdit text4" type="button" onClick={() => {setEditMeal(true)}}>Edit</button>
                                        </div>
                                    }
                                </div>
                                <div className="recipeEditRowServings">
                                    <p className="text3">Number of servings</p>
                                    {editServings ?
                                        <div className="recipeEditPairRow">
                                            <input className="textInputRecipe text5" type="text" name="servings" placeholder="Servings" maxLength="2" value={servings} autoFocus onChange={e => {setServings(e.target.value)}} />
                                            {errors.servings && <p className="displayError text5">{errors.servings}</p> }
                                            <button className="recipeCancel text4" type="button" onClick={() => {cancelEdit("servings")}}>Cancel</button>
                                        </div>
                                    :
                                        <div className="recipeEditPairRow">
                                            <p className="textDisplayRecipe text5">{servings}</p>
                                            <button className="recipeEdit text4" type="button" onClick={() => {setEditServings(true)}}>Edit</button>
                                        </div>
                                    }
                                </div>
                            </div>
                            <p className="text3">Cooking time</p>
                            <p className="text5">(Hours, Minutes)</p>
                            {editTime ?
                                <div className="recipeEditPairRow">
                                    <input className="textInputRecipe text5" type="text" name="timeHr" placeholder={"Hours"} value={timeHr} autoFocus onChange={e => {setTimeHr(e.target.value)}} />
                                    <input className="textInputRecipe text5" type="text" name="timeMin" placeholder={"Minutes"} value={timeMin} onChange={e => {setTimeMin(e.target.value)}} />
                                    <button className="recipeCancel text4" type="button" onClick={() => {cancelEdit("time")}}>Cancel</button>
                                </div>
                            :
                                <div className="recipeEditPairRow">
                                    <p className="textDisplayRecipe text5">{displayTime()}</p>
                                    <button className="recipeEdit text4" type="button" onClick={() => {setEditTime(true)}}>Edit</button>
                                </div>
                            }
                            <p className="text3">Ingredients</p>
                            <p className="text5">(Ingredient, Measurement, Unit)</p>
                            {editIngredients ?
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
                                                        {ingredients.length !== 1 && <button className="recipeRemoveIngredient text4" type="button" onClick={() => handleRemoveIngredients(i)}>Remove</button>}
                                                    </div>
                                                    {ingredients.length - 1 === i && <button className="recipeAddIngredient text4" type="button" onClick={handleAddIngredients}>Add ingredient</button>}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <button className="recipeCancel text4" type="button" onClick={() => {cancelEdit("ingredients")}}>Cancel</button>
                                </div>
                            :
                                <div className="recipeEditPairRow">
                                    <div className="recipeEditPairColumn">
                                        {ingredients.map((ingredient, i) => {
                                            return (
                                                <p className="textDisplayRecipe text5" key={i}>{ingredient.measurement + ingredient.unit + " " + ingredient.ingredient}</p>
                                            )
                                        })}
                                    </div>
                                    <button className="recipeEdit text4" type="button" onClick={() => {setEditIngredients(true)}}>Edit</button>
                                </div>
                            }
                            <p className="text3">Steps</p>
                            {editSteps ?
                                <div className="recipeEditPairRow">
                                    <div style={{width: "100%"}}>   
                                        {steps.map((step, i) => {
                                            return (
                                                <div key={i}>
                                                    <div className="recipeEditRowSteps">
                                                        <textarea className="textareaInput recipeEditRowStep textInputRecipe text5" type="text" name="steps" placeholder="Instruction" maxLength="500" rows="5" value={step} onChange={e => handleInputSteps(e.target.value, i)} />
                                                        {steps.length !== 1 && <button className="recipeRemoveStep text4" type="button" onClick={() => handleRemoveSteps(i)}>Remove</button>}
                                                    </div>
                                                    {steps.length - 1 === i && <button className="recipeAddStep text4" type="button" onClick={handleAddSteps}>Add instruction</button>}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <button className="recipeCancel text4" type="button" onClick={() => {cancelEdit("steps")}}>Cancel</button>
                                </div>
                            :
                                <div className="recipeEditPairRow">
                                    <div className="recipeEditPairColumn">
                                        {steps.map((step, i) => {
                                            return (
                                                <p className="textDisplayRecipe text5" key={i}>{step}</p>
                                            )
                                        })}
                                    </div>
                                    <button className="recipeEdit text4" type="button" onClick={() => {setEditSteps(true)}}>Edit</button>
                                </div>
                            }
                        </div>
                        <div>
                            <input className="recipeUpdate text4" type="submit" value="Update recipe" />
                            <Link type="button" className="recipeReturn text4" to={`/recipes/${recipeID}`}>Cancel</Link>
                        </div>
                    </form>
                </div>
                :
                null
            }
        </>
    )
}

export default EditRecipe
