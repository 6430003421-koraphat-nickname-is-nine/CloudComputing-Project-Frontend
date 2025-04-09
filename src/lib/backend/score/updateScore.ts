export async function updateScore(username: string, newScore: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/score/${username}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newScore }),
    }
  );
  if (!res.ok) {
    throw new Error("Something went wrong");
  }
  const data = await res.json();
  return data;
}
