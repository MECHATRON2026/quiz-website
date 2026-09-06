import questions from '../data/questions.json';

export default function Quiz() {
  const question = questions[0];
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Quiz Page</h1>
      <p className="mt-2">{question.question_text}</p>
      <ul className="mt-2">
        {question.options?.map((opt) => (
          <li key={opt}>{opt}</li>
        ))}
      </ul>
    </div>
  );
}