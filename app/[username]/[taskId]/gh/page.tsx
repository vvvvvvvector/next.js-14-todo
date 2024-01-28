import { db } from '~/lib/db';

const getRepoMetadata = async (taskId: string) => {
  const repo = await db.repo.findUnique({
    where: {
      taskId
    }
  });

  const meta = await fetch(`https://api.github.com/repos/${repo?.fullName}`);

  const json = await meta.json();

  return json;
};

export default async function RepoMetaPage({
  params
}: {
  params: {
    username: string;
    taskId: string;
  };
}) {
  const meta = await getRepoMetadata(params.taskId);

  return <pre>{JSON.stringify(meta, null, 2)}</pre>;
}
