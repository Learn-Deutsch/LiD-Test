import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserLanding } from "./pages/UserLanding";
import { QuizPage } from "./pages/QuizPage";
import { ResultPage } from "./pages/ResultPage";
import { FlashcardReview } from "./pages/FlashcardReview";
import { LoginPage } from "./pages/LoginPage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

function App() {
  const [user] = useAuthState(auth);

  return (
    <Router basename="/LiD-Test">
      <Routes>
        {/* Admin Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={user ? <AdminDashboard /> : <Navigate to="/login" />} />

        {/* User Quiz Flow */}
        <Route path="/" element={<UserLanding />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/review" element={<FlashcardReview />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
