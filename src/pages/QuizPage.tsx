import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export function QuizPage() {
  const [questions, setQuestions] = useState<DocumentData[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const navigate = useNavigate();

  const userName = localStorage.getItem("quizUserName") || "Guest";
  const userState = localStorage.getItem("quizUserState") || "BW";

  useEffect(() => {
    const fetchQuestions = async () => {
      const snapshot = await getDocs(collection(db, "questions"));
      const all = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const general = all
        .filter((q) => q.source === "general")
        .sort(() => 0.5 - Math.random())
        .slice(0, 30);

      const state = all
        .filter((q) => q.source === "state" && q.state === userState)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const combined = [...general, ...state].sort(() => 0.5 - Math.random());
      setQuestions(combined);
      setAnswers(new Array(combined.length).fill(-1));
    };

    fetchQuestions();
  }, [userState]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (index: number) => {
    const updated = [...answers];
    updated[current] = index;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    const correct = questions.filter((q, i) => q.correctAnswer === answers[i]);
    const wrong = questions.filter((q, i) => q.correctAnswer !== answers[i]);
    localStorage.setItem("quizScore", `${correct.length}`);
    localStorage.setItem("quizWrong", JSON.stringify(wrong.map((q) => q.id)));
    navigate("/result");
  };

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  if (!questions.length) return <p className="p-4">Loading questions...</p>;

  const q = questions[current];

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="text-right text-sm text-gray-600 mb-2">
        Time Left: {formatTime(timeLeft)}
      </div>
      <h2 className="text-xl font-semibold mb-4">{current + 1}. {q.text}</h2>
      {q.images?.map((img: string, idx: number) => (
        <img key={idx} src={img} alt="q" className="mb-2 max-w-xs" />
      ))}
      <ul className="space-y-2 mb-4">
        {q.options.map((opt: any, i: number) => (
          <li
            key={i}
            className={`p-2 border rounded cursor-pointer ${answers[current] === i ? 'bg-blue-100' : ''}`}
            onClick={() => handleAnswer(i)}
          >
            {opt.text}
            {opt.imageUrl && <img src={opt.imageUrl} alt="opt" className="w-10 h-10 inline-block ml-2" />}
          </li>
        ))}
      </ul>
      <div className="flex justify-between">
        <button
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
        >
          Previous
        </button>
        {current < questions.length - 1 ? (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setC
