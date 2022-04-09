import { ActionFunction, Form, Link, LoaderFunction, useLoaderData, useTransition } from 'remix';

const projects = [{
  title: '123',
  slug: '123'
}];

function getProjects() {
  return projects;
}

function createProject(obj: { title: any; }) {
  projects.push({
    title: obj.title,
    slug: obj.title,
  });
  return projects;
}

export const loader: LoaderFunction = async ({ request }) => {
  return getProjects();
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  return createProject({ title: form.get('title') });
};

export default function Projects() {
  const projects = useLoaderData();
  const { state } = useTransition();
  const busy = state === 'submitting';

  return (
    <div>
      {projects.map((project: any) => (
        <Link key={project.title} to={project.slug}>{project.title}</Link>
      ))}

      <Form method="post">
        <input name="title" />
        <button type="submit" disabled={busy}>
          {busy ? 'Creating...' : 'Create New Project'}
        </button>
      </Form>
    </div>
  );
}
