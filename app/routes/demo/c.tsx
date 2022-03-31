import useStore from '~/stores';

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
    <h1>试一下zustand管理状态</h1>
    <Controls />
    <Controls />
    <Controls />
    <BearCounter />
    <BearCounter />
    <BearCounter />
    <BearCounter />
  </>;
};

export default B;
