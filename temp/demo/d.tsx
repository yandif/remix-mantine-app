import { json, useLoaderData } from 'remix';

export const loader = async () => {
  return json([
    {
      slug: 'my-first-post',
      title: 'My First Post',
    },
    {
      slug: '90s-mixtape',
      title: 'A Mixtape I Made Just For You',
    },
  ]);
};

export default function Posts() {
  const posts = useLoaderData();

  return (
    <main>
      <h1>{JSON.stringify(posts)}</h1>
    </main>
  );
}
