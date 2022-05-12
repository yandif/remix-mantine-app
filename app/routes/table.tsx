import type { FC } from 'react';

import Table from '~/components/Table';

const Ta: FC = () => {
  return (
    <Table
      columns={[
        {
          Header: 'First Name',
          accessor: 'firstName',
        },
        {
          Header: 'Last Name',
          accessor: 'lastName',
        },
        {
          Header: 'Age',
          accessor: 'age',
        },
        {
          Header: 'Visits',
          accessor: 'visits',
        },
        {
          Header: 'Status',
          accessor: 'status',
        },
        {
          Header: 'Profile Progress',
          accessor: 'progress',
        },
      ]}
      data={[
        {
          firstName: 'woman',
          lastName: 'lock',
          age: 10,
          visits: 76,
          progress: 92,
          status: 'relationship',
        },
      ]}
    />
  );
};

export default Ta;
