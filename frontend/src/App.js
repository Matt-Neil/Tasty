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
import NewRecipe from "./Components/New-Recipe"
import NotFound from './Pages/NotFound';

export default function App() {
  const [searchPhrase, setSearchPhrase] = useState(null);

  return (
    <Router>
      <Header setSearchPhrase={setSearchPhrase} />
        <div>
          <Switch>
            <Route path="/recipes/ingredients/:id" render={(props) => <IngredientRecipes key={props.location.key} />} />
            <Route path="/search/:id" render={(props) => <Search searchPhrase={searchPhrase} key={props.location.key} />} />
            <Route exact path="/recipes/dinner">
              <DinnerRecipes />
            </Route>
            <Route exact path="/recipes/dessert">
              <DessertRecipes />
            </Route>
            <Route path="/my-feed">
              <FeedRecipes />
            </Route>
            <Route path="/recipes/:id" render={(props) => <ViewRecipe key={props.location.key} />} />
            <Route path="/sign-in">
              <SignIn />
            </Route>
            <Route path="/user/:id" render={(props) => <Account key={props.location.key} />} />
            <Route path="/my-profile">
              <Profile />
            </Route>
            <Route path="/new-recipe">
              <AddRecipe />
            </Route>
            <Route path="/edit-recipe/:id"  render={(props) => <EditRecipe key={props.location.key} />} />
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
        <NewRecipe />
      <Footer />
    </Router>
  );
}