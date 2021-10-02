import React, {useState, useContext} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
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
import OpenChat from "./Components/OpenChat"
import Chat from './Pages/Chat';
import { CurrentUserContext } from './Contexts/currentUserContext';

export default function App() {
  const [searchPhrase, setSearchPhrase] = useState(null);
  const {currentUser} = useContext(CurrentUserContext);

  return (
    <Router>
      <Header setSearchPhrase={setSearchPhrase} />
      <div className="mainBody">
        <Switch>
          <Route path="/recipes/ingredients/:id" render={(props) => <IngredientRecipes key={props.location.key} />} />
          <Route path="/search/:id" render={(props) => <Search searchPhrase={searchPhrase} key={props.location.key} />} />
          <Route exact path="/recipes/dinner">
            <DinnerRecipes />
          </Route>
          <Route exact path="/recipes/dessert">
            <DessertRecipes />
          </Route>
          <Route path="/recipes/:id" render={(props) => <ViewRecipe key={props.location.key} />} />
          <Route path="/sign-in">
            <SignIn />
          </Route>
          <Route path="/user/:id" render={(props) => <Account currentUser={currentUser} key={props.location.key} />} />
          <Route exact path="/">
            <Home currentUser={currentUser} />
          </Route>
          {currentUser.loaded &&
            <>
              {currentUser.empty ?
                <Redirect to={"/sign-in"} />
              :
                <>
                  <Route path="/my-feed">
                    <FeedRecipes />
                  </Route>
                  <Route path="/my-profile">
                    <Profile />
                  </Route>
                  <Route path="/new-recipe">
                    <AddRecipe />
                  </Route>
                  <Route path="/chat">
                    <Chat />
                  </Route>
                  <Route path="/edit-recipe/:id"  render={(props) => <EditRecipe key={props.location.key} />} />
                </>
              }
            </>
          }  
        </Switch>
      </div>
      <div className="bottomButtons">
        <OpenChat />
        <NewRecipe />
      </div>
      <Footer />
    </Router>
  );
}