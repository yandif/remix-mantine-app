import type { FC } from 'react';
import { Link } from 'remix';

const Index: FC = () => {
  return (
    <div>
      <h1>Home</h1>
      <Link to="admin">管理端</Link>
      <br />
      <Link to="blog">博客</Link>
    </div>
  );
};

export default Index;
