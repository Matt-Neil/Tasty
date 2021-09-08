import React, {useEffect, useState} from 'react'
import {Link} from "react-router-dom"
import AddIcon from '@material-ui/icons/Add';

const NewRecipe = () => {
    const [mobile, setMobile] = useState(window.innerWidth < 801);

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    });

    const updateMedia = () => {
        setMobile(window.innerWidth < 801);
    };

    return (
        <Link to="/new-recipe" className="newRecipeButton">
            {!mobile ?
                <>
                    <AddIcon style={{fontSize: 24, color: "#FFFFFF", marginRight: 7}} />
                    <p className="text4">New recipe</p>
                </>
            :
                <AddIcon style={{fontSize: 24, color: "#FFFFFF"}} />
            }
        </Link>
    )
}

export default NewRecipe
