import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const peopleQueryOptions = queryOptions({
  queryKey: ["people"],
  queryFn: () => Promise.resolve([{ name: "John Doe" }, { name: "Fernando Doe" }]),
});

export const Route = createFileRoute("/demo/tanstack-query")({
  component: TanStackQueryDemo,
  loader: ({ context }) => context.queryClient.ensureQueryData(peopleQueryOptions),
});

function TanStackQueryDemo() {
  const { data } = useSuspenseQuery(peopleQueryOptions);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">People list</h1>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}
