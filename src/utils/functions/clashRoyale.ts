/** @param {string} url URL to the Clash Royale API */
export async function FetchClashRoyale(url: string) {
  const data = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.CLASH_ROYALE_API_KEY}`
    }
  });

  const json = data.json();

  return json;
}
