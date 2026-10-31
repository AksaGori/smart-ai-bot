import { prevUser } from "./context/UserContext";

export async function query() {
  const response = await fetch("https://my-image-generator.aqsagori23.workers.dev/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prevUser.prompt,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Image generation failed");
  }

  return result.dataURI;
}

