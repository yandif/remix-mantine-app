import { Link } from 'remix';

import useStore from '~/stores';

import C from './c';
function BearCounter() {
  const bears = useStore((state) => state.bears);
  return <span>{bears} around here ...</span>;
}

function Controls() {
  const increasePopulation = useStore((state) => state.increasePopulation);
  return <button onClick={increasePopulation}>one up</button>;
}

const B = () => {
  return <>
    <Link to="/c" >aaa</Link>
    <h1>试一下zustand管理状态</h1>
    <Controls />
    <Controls />
    <Controls />
    <BearCounter />
    <BearCounter />
    <BearCounter />
    <BearCounter />
    <C />
  </>;
};

export default B;
