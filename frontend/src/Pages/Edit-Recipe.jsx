import React, {useState, useEffect} from 'react'
import {useParams, useHistory} from "react-router-dom"
import recipeAPI from "../API/recipes"
import imageAPI from "../API/image"

const EditRecipe = () => {
    const [recipe, setRecipe] = useState();
    const [pictureFile, setPictureFile] = useState("");
    const [pictureName, setPictureName] = useState("");
    const [steps, setSteps] = useState([""]);
    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState([{ ingredient: "", measurement: null, unit: ""}]);
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
    const recipeID = useParams().id;
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await recipeAPI.get(`/recipe/${recipeID}`);

                if (response.data.user) {
                    setRecipe(response.data.data.recipe);
                    setLoaded(true);
                } else {
                    history.replace('/');
                }
            } catch (err) {}
        }
        fetchData();
    }, [recipeID]);

    useEffect(() => {
        if (loaded) {
            if (recipe.ingredients.length === 0) {
                setIngredients([{ ingredient: "", measurement: undefined, unit: ""}]);
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

        const formData = new FormData();
        formData.append('picture', pictureFile);

        const uploadResponse = await imageAPI.post("/upload", formData);

        setPictureName(uploadResponse.data.data);
    }

    const removePicture = async () => {
        if (pictureFile !== "") {
            await imageAPI.put('/remove', {picture: pictureName});
            setPictureFile("");
            setPictureName(recipe.picture);
        }
    }

    const updateRecipe = async (e) => {
        e.preventDefault();

        const ingredientsList = [...ingredients];
        const stepsList = [...steps];

        if (pictureName !== recipe.picture) {
            await imageAPI.put('/remove', {picture: recipe.picture});
        }

        {ingredients.map((x, i) => {
            if (x.ingredient === "" && x.measurement === null && x.unit === "") {
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
            rating: recipe.rating,
            title: title,
            ingredients: ingredients,
            reviews: recipe.reviews,
            time: {min: timeMin, hr: timeHr},
            servings: servings,
            description: description,
            difficulty: difficulty,
            date: recipe.date,
            meal: meal,
            creator: recipe.creator
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
        setIngredients([...ingredients, { ingredient: "", measurement: null, unit: "" }]);
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
                    setIngredients([{ ingredient: "", measurement: null, unit: ""}]);
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
        <div className="mainBody">
            {loaded ?
                <>
                    {editPicture ?
                        <>
                            <form method="POST" onSubmit={uploadPicture} encType="multipart/form-data">
                                <div>
                                    <input type="file" name="picture" onChange={e => {setPictureFile(e.target.files[0])}} />
                                </div>
                                <div>
                                    <input type="submit" value="Upload Image" />
                                </div>
                            </form>
                            <button onClick={() => {removePicture()}}>Remove</button>
                            <button type="button" onClick={() => {cancelEdit("picture")}}>Cancel</button>
                        </>
                    :
                        <>
                            <img />
                            <button type="button" onClick={() => {setEditPicture(true)}}>Edit</button>
                        </>
                    }
                    
                    <form method="PUT" onSubmit={updateRecipe}>
                        <div>
                            {editTitle ?
                                <>
                                    <input type="text" name="title" placeholder="title" value={title} onChange={e => {setTitle(e.target.value)}} />
                                    <button type="button" onClick={() => {cancelEdit("title")}}>Cancel</button>
                                </>
                            :
                                <>
                                    <p>{title}</p>
                                    <button type="button" onClick={() => {setEditTitle(true)}}>Edit</button>
                                </>
                            }
                            {editDescription ?
                                <>
                                    <input type="text" name="description" placeholder="description" value={description} onChange={e => {setDescription(e.target.value)}} />
                                    <button type="button" onClick={() => {cancelEdit("description")}}>Cancel</button>
                                </>
                            :
                                <>
                                    <p>{description}</p>
                                    <button type="button" onClick={() => {setEditDescription(true)}}>Edit</button>
                                </>
                            }
                            {editDifficulty ?
                                <>
                                    <select name="difficulty" onChange={e => {setDifficulty(e.target.value)}}>
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                    <button type="button" onClick={() => {cancelEdit("difficulty")}}>Cancel</button>
                                </>
                            :
                                <>
                                    <p>{difficulty}</p>
                                    <button type="button" onClick={() => {setEditDifficulty(true)}}>Edit</button>
                                </>
                            }
                            {editTime ?
                                <>
                                    <input type="text" name="timeHr" placeholder={"hr"} value={timeHr} onChange={e => {setTimeHr(e.target.value)}} />
                                    <input type="text" name="timeMin" placeholder={"min"} value={timeMin} onChange={e => {setTimeMin(e.target.value)}} />
                                    <button type="button" onClick={() => {cancelEdit("time")}}>Cancel</button>
                                </>
                            :
                                <>
                                    <p>{displayTime()}</p>
                                    <button type="button" onClick={() => {setEditTime(true)}}>Edit</button>
                                </>
                            }
                            {editServings ?
                                <>
                                    <input type="text" name="servings" placeholder="servings" value={servings} onChange={e => {setServings(e.target.value)}} />
                                    <button type="button" onClick={() => {cancelEdit("servings")}}>Cancel</button>
                                </>
                            :
                                <>
                                    <p>{servings}</p>
                                    <button type="button" onClick={() => {setEditServings(true)}}>Edit</button>
                                </>
                            }
                            {editMeal ?
                                <>
                                    <select name="meal" onChange={e => {setMeal(e.target.value)}}>
                                        <option value="Dinner">Dinner</option>
                                        <option value="Dessert">Dessert</option>
                                    </select>
                                    <button type="button" onClick={() => {cancelEdit("meal")}}>Cancel</button>
                                </>
                            :
                                <>
                                    <p>{meal}</p>
                                    <button type="button" onClick={() => {setEditMeal(true)}}>Edit</button>
                                </>
                            }
                            {editIngredients ?
                                <>
                                    {ingredients.map((ingredient, i) => {
                                        return (
                                            <div key={i}>
                                                <input type="text" name="ingredient" placeholder="ingredient" value={ingredient.ingredient} onChange={e => handleInputIngredients(e.target, i)} />
                                                <input type="text" name="measurement" placeholder="measurement" value={ingredient.measurement} onChange={e => handleInputIngredients(e.target, i)} />
                                                <select name="unit" onChange={e => handleInputIngredients(e.target, i)}>
                                                    <option value="">none</option>
                                                    <option value="ml">ml</option>
                                                    <option value="l">l</option>
                                                    <option value="g">g</option>
                                                    <option value="kg">kg</option>
                                                    <option value="tbsp">tbsp</option>
                                                    <option value="tsp">tsp</option>
                                                </select>
                                                {ingredients.length !== 1 && <button type="button" onClick={() => handleRemoveIngredients(i)}>Remove</button>}
                                                {ingredients.length - 1 === i && <button type="button" onClick={handleAddIngredients}>Add</button>}
                                            </div>
                                        )
                                    })}
                                    <button type="button" onClick={() => {cancelEdit("ingredients")}}>Cancel</button>
                                </>
                            :
                                <>
                                    {ingredients.map((ingredient, i) => {
                                        return (
                                            <p key={i}>{ingredient.measurement + ingredient.unit + " " + ingredient.ingredient}</p>
                                        )
                                    })}
                                    <button type="button" onClick={() => {setEditIngredients(true)}}>Edit</button>
                                </>
                            }
                            {editSteps ?
                                <>
                                    {steps.map((x, i) => {
                                        return (
                                            <div key={i}>
                                                <input type="text" name="steps" placeholder="step" value={steps} onChange={e => handleInputSteps(e.target.value, i)} />
                                                {steps.length !== 1 && <button type="button" onClick={() => handleRemoveSteps(i)}>Remove</button>}
                                                {steps.length - 1 === i && <button type="button" onClick={handleAddSteps}>Add</button>}
                                            </div>
                                        )
                                    })}
                                    <button type="button" onClick={() => {cancelEdit("steps")}}>Cancel</button>
                                </>
                            :
                                <>
                                    {steps.map((step, i) => {
                                        return (
                                            <p key={i}>{step}</p>
                                        )
                                    })}
                                    <button type="button" onClick={() => {setEditSteps(true)}}>Edit</button>
                                </>
                            }
                        </div>
                        <div>
                            <input type="submit" value="Update Recipe" />
                        </div>
                    </form>
                </>
                :
                null
            }
        </div>
    )
}

export default EditRecipe
