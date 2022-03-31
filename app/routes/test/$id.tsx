import type { LoaderFunction } from 'remix';
import { useLoaderData } from 'remix';

export const loader: LoaderFunction = async ({
  params,
}) => {
  return params?.id;
};

export default function Tool() {
  const id: string = useLoaderData();
  const map: any = {
    1: <Demo1 />
  };
  return map[id];
}

function Demo1() {
  return <div>1</div>;
}
