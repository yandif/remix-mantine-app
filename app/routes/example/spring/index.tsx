import { useEffect } from 'react';
import { animated, config, useSpring } from 'react-spring';

export default function IndexRoute() {
  const [{ x }, interpolate] = useSpring(() => ({
    from: { x: 0 },
    config: config.wobbly,
  }));

  const { opacity } = useSpring({
    from: { opacity: 0 },
    opacity: 1,
    config: config.slow,
    delay: 200,
  });

  useEffect(() => {
    const a = () => {
      interpolate({ x: 0 });
      setTimeout(() => {
        interpolate({ x: 1 });
        setTimeout(() => { a(); }, 1000);
      }, 1000);
    };
    a();
  }, []);
  return (
    <animated.h1
      onMouseEnter={() => {
        interpolate({ x: 1 });
      }}
      onMouseLeave={() => {
        interpolate({ x: 0 });
      }}
      style={{
        width: '100px',
        textAlign: 'center',
        margin: '0 auto',
        cursor: 'pointer',
        opacity,
        color: x.to({ range: [0, 1], output: ['#000', '#f00'] }),
        scale: x.to({ range: [0, 1], output: [1, 1.5] }),
      }}
    >
      哈哈
    </animated.h1>
  );
}
