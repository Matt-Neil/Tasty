import React, {useEffect, useState} from 'react'
import {Link} from "react-router-dom"
import AddIcon from '@material-ui/icons/Add';

const NewRecipe = () => {
    return (
        <Link to="/new-recipe" className="newRecipeButton">
            <AddIcon style={{fontSize: 24, color: "#FFFFFF"}} />
        </Link>
    )
}

export default NewRecipe
