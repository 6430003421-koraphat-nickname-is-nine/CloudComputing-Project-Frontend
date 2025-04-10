export default async function getScore(username: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/score/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      body: JSON.stringify({ username }),
    },
  });
  if (!res) {
    throw new Error("Failed to fetch score of " + username);
  }
  const data = await res.json();
  return data;
}
