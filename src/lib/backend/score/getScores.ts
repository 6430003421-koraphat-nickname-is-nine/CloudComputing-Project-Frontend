export default async function getScores() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/score/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res) {
    throw new Error("Failed to fetch score of all users");
  }
  const data = await res.json();
  return data;
}
