import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { RecipeProvider } from "./context/RecipeContext";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Community } from "./pages/Community";
import { Library } from "./pages/Library";
import { RecipeDetail } from "./pages/RecipeDetail";
import { CommitRecipe } from "./pages/CommitRecipe";
import { Saved } from "./pages/Saved";
import { Leaderboard } from "./pages/Leaderboard";
import { Notifications } from "./pages/Notifications";
import { Profile } from "./pages/Profile";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <RecipeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="kitchen-bg flex min-h-screen flex-col">
          <NavBar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/community" element={<Community />} />
              <Route path="/library" element={<Library />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/commit" element={<CommitRecipe />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </RecipeProvider>
  );
}

export default App;
