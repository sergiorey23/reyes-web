import { sanityClient } from "sanity:client";

export async function GET({ request }) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '0', 10);
  const limit = 3;

  // page 0 was already loaded on the server (initial 3 reviews: 0, 1, 2)
  // page 1 means items 3 to 5
  // page 2 means items 6 to 8
  const start = (page + 1) * limit;
  const end = start + limit;

  try {
    const reviews = await sanityClient.fetch(
      `*[_type == "review" && approved == true] | order(date desc)[$start...$end]`,
      { start, end }
    );
    return new Response(JSON.stringify(reviews), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return new Response(JSON.stringify({ error: "Error fetching reviews" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
