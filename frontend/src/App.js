import React, {useState} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./global.css";

import Header from "./Components/Header"
import Footer from "./Components/Footer"
import Home from "./Pages/Home"
import Account from "./Pages/Account"
import Profile from "./Pages/Profile"
import SignIn from "./Pages/Sign-In"
import ViewRecipe from "./Pages/View-Recipe"
import AddRecipe from "./Pages/Add-Recipe"
import EditRecipe from "./Pages/Edit-Recipe"
import IngredientRecipes from "./Pages/Ingredient-Recipes"
import DinnerRecipes from "./Pages/Dinner-Recipes"
import DessertRecipes from "./Pages/Dessert-Recipes"
import FeedRecipes from "./Pages/Feed-Recipes"
import Search from "./Pages/Search"

export default function App() {
  const [searchPhrase, setSearchPhrase] = useState(null);

  return (
    <Router>
      <Header setSearchPhrase={setSearchPhrase} />
        <div>
          <Switch>
            <Route path="/recipes/ingredients/:id">
              <IngredientRecipes />
            </Route>
            <Route path="/search/:id">
              <Search searchPhrase={searchPhrase} />
            </Route>
            <Route exact path="/recipes/dinner">
              <DinnerRecipes />
            </Route>
            <Route exact path="/recipes/dessert">
              <DessertRecipes />
            </Route>
            <Route path="/my-feed">
              <FeedRecipes />
            </Route>
            <Route path="/recipes/:id">
              <ViewRecipe />
            </Route>
            <Route path="/sign-in">
              <SignIn />
            </Route>
            <Route path="/user/:id">
              <Account />
            </Route>
            <Route path="/my-profile">
              <Profile />
            </Route>
            <Route path="/new-recipe">
              <AddRecipe />
            </Route>
            <Route path="/edit-recipe/:id">
              <EditRecipe />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      <Footer />
    </Router>
  );
}