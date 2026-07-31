import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { RecipeProvider } from "./context/RecipeContext";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { RequireAuth } from "./components/RequireAuth";
import { Home } from "./pages/Home";
import { Community } from "./pages/Community";
import { Library } from "./pages/Library";
import { RecipeDetail } from "./pages/RecipeDetail";
import { CommitRecipe } from "./pages/CommitRecipe";
import { Saved } from "./pages/Saved";
import { Leaderboard } from "./pages/Leaderboard";
import { Notifications } from "./pages/Notifications";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";

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
              <Route path="/login" element={<Login />} />
              <Route
                path="/commit"
                element={
                  <RequireAuth>
                    <CommitRecipe />
                  </RequireAuth>
                }
              />
              <Route path="/saved" element={<Saved />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route
                path="/notifications"
                element={
                  <RequireAuth>
                    <Notifications />
                  </RequireAuth>
                }
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </RecipeProvider>
  );
}

export default App;
