import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

export function AdminDashboard() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      const querySnapshot = await getDocs(collection(db, "questions"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(data);
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  const updateCorrectAnswer = async (id: string, index: number) => {
    const ref = doc(db, "questions", id);
    await updateDoc(ref, { correctAnswer: index });
    alert("✅ Correct answer saved.");
  };

  if (loading) return <p className="p-4">Loading questions...</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {questions.map((q, i) => (
        <div key={q.id} className="border rounded mb-6 p-4 bg-white shadow">
          <h2 className="font-semibold mb-2">
            {i + 1}. {q.text}
          </h2>

          {q.images?.map((img: string, idx: number) => (
            <img
              key={idx}
              src={img}
              alt={`question ${i}`}
              className="mb-2 max-w-xs"
            />
          ))}

          <ul className="space-y-2">
            {q.options.map((opt: any, index: number) => (
              <li key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${q.id}`}
                  checked={q.correctAnswer === index}
                  onChange={() => updateCorrectAnswer(q.id, index)}
                />
                <span>{opt.text}</span>
                {opt.imageUrl && (
                  <img
                    src={opt.imageUrl}
                    alt="option"
                    className="w-10 h-10 ml-2"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
