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
    const [ingredients, setIngredients] = useState([{ ingredient: "", measurement: undefined, unit: "none"}]);
    const [timeMin, setTimeMin] = useState(undefined);
    const [timeHr, setTimeHr] = useState(undefined);
    const [servings, setServings] = useState(undefined);
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");
    const [meal, setMeal] = useState("Dinner");
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await authAPI.get(`/`);

                if (response.data.user) {
                    setUser(response.data.data);
                } else {
                    history.replace('/');
                }
            } catch (err) {}
        }
        fetchData();
    }, []);

    const uploadPicture = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('picture', pictureFile);

        const uploadResponse = await imageAPI.post("/upload", formData);

        setPictureName(uploadResponse.data.data);
    }

    const removePicture = async () => {
        if (pictureFile !== "default.png") {
            await imageAPI.put('/remove', {picture: pictureName});
            setPictureFile("");
            setPictureName("default.png");
        }
    }

    const createRecipe = async (e) => {
        e.preventDefault();
        e.target.reset();
        
        const ingredientsList = [...ingredients];
        const stepsList = [...steps];

        {ingredients.map((x, i) => {
            if (x.ingredient === "" && x.measurement === undefined && x.unit === "none") {
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
        
        const updateResponse = await recipeAPI.post(`/recipe`, 
        {
            picture: pictureName,
            steps: steps,
            rating: 0,
            title: title,
            ingredients: ingredients,
            reviews: [],
            time: {min: timeMin, hr: timeHr},
            servings: servings,
            description: description,
            difficulty: difficulty,
            date: moment().format('DD/MM/YYYY'),
            meal: meal,
            creator: user._id
        });

        await userAPI.put(`profile?update=created`, {
            id: updateResponse.data.data
        })

        setPictureName("");
        setSteps([""]);
        setTitle("");
        setIngredients([{ ingredient: "", measurement: undefined, unit: "none"}]);
        setTimeMin(undefined);
        setTimeHr(undefined);
        setServings(undefined);
        setDescription("");
        setDifficulty("");
        setMeal("");

        history.push(`/recipes/${updateResponse.data.data}`);
    }

    const handleInputChangeIngredients = (e, index) => {
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
    };
    
    const handleRemoveClickIngredients = (index) => {
        const list = [...ingredients];
        list.splice(index, 1);
        setIngredients(list);
    };
    
    const handleAddClickIngredients = () => {
        setIngredients([...ingredients, { ingredient: "", measurement: undefined, unit: "none" }]);
    };

    const handleInputChangeSteps = (e, index) => {
        const list = [...steps];
        list[index] = e;
        setSteps(list);
    };
    
    const handleRemoveClickSteps = (index) => {
        const list = [...steps];
        list.splice(index, 1);
        setSteps(list);
    };
    
    const handleAddClickSteps = () => {
        setSteps([...steps, ""]);
    };

    return (
        <div className="mainBody">
            <form method="POST" onSubmit={uploadPicture} encType="multipart/form-data">
                <div>
                    <input type="file" name="picture" onChange={e => {setPictureFile(e.target.files[0])}} />
                </div>
                <div>
                    <input type="submit" value="Upload Image" />
                </div>
            </form>
            <button onClick={() => {removePicture()}}>Remove</button>
            <form method="POST" onSubmit={createRecipe}>
                <div>
                    <input type="text" name="title" placeholder="title" value={title} onChange={e => {setTitle(e.target.value)}} />
                    <input type="text" name="description" placeholder="description" value={description} onChange={e => {setDescription(e.target.value)}} />
                    <select name="difficulty" onChange={e => {setDifficulty(e.target.value)}}>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    <input type="text" name="timeHr" placeholder="time hr" value={timeHr} onChange={e => {setTimeHr(e.target.value)}} />
                    <input type="text" name="timeMin" placeholder="time min" value={timeMin} onChange={e => {setTimeMin(e.target.value)}} />
                    <input type="text" name="servings" placeholder="servings" value={servings} onChange={e => {setServings(e.target.value)}} />
                    <select name="meal" onChange={e => {setMeal(e.target.value)}}>
                        <option value="Dinner">Dinner</option>
                        <option value="Dessert">Dessert</option>
                    </select>
                    {ingredients.map((ingredient, i) => {
                        return (
                            <div key={i}>
                                <input type="text" name="ingredient" placeholder="ingredient" value={ingredient.ingredient} onChange={e => handleInputChangeIngredients(e.target, i)} />
                                <input type="text" name="measurement" placeholder="measurement" value={ingredient.measurement} onChange={e => handleInputChangeIngredients(e.target, i)} />
                                <select name="unit" onChange={e => handleInputChangeIngredients(e.target, i)}>
                                    <option value="none">none</option>
                                    <option value="ml">ml</option>
                                    <option value="l">l</option>
                                    <option value="g">g</option>
                                    <option value="kg">kg</option>
                                    <option value="tbsp">tbsp</option>
                                    <option value="tsp">tsp</option>
                                </select>
                                {ingredients.length !== 1 && <button type="button" onClick={() => handleRemoveClickIngredients(i)}>Remove</button>}
                                {ingredients.length - 1 === i && <button type="button" onClick={handleAddClickIngredients}>Add</button>}
                            </div>
                        )
                    })}
                    {steps.map((step, i) => {
                        return (
                            <div key={i}>
                                <input type="text" name="steps" placeholder="steps" value={step} onChange={e => handleInputChangeSteps(e.target.value, i)} />
                                {steps.length !== 1 && <button type="button" onClick={() => handleRemoveClickSteps(i)}>Remove</button>}
                                {steps.length - 1 === i && <button type="button" onClick={handleAddClickSteps}>Add</button>}
                            </div>
                        )
                    })}
                </div>
                <div>
                    <input type="submit" value="Create Recipe" />
                </div>
            </form>
        </div>
    )
}

export default AddRecipe