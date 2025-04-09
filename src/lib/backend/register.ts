export async function register(username: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    throw new Error("Something went wrong");
  }
  const data = await res.json();
  return data;
}
