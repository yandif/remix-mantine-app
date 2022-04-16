import type { FC } from 'react';
import { Link } from 'remix';

const Main: FC = () => {
  return <div>
    <h1>Home</h1>
    <Link to="admin" >
      管理端
    </Link>
    <br />
    <Link to="example/message" >
      例子:消息
    </Link>
    <br />
    <Link to="example/spring" >
      例子:弹簧
    </Link>
  </div>;
};

export default Main;
