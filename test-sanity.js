import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '1arljs9t',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03'
});

async function check() {
  try {
    const posts = await client.fetch(`*[_type == "post"]`);
    console.log(JSON.stringify(posts, null, 2));
  } catch (e) {
    console.error(e);
  }
}

check();
