/* eslint-disable @typescript-eslint/no-explicit-any */
async function getOwner() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) return null;
  const list = await res.json();
  return list.find((u: any) => ["ADMIN", "SUPER_ADMIN"].includes(u.role));
}

export default async function AboutSummary() {
  const owner = await getOwner();
  if (!owner) return <div>Owner profile not found.</div>;

  return (
    <div className="prose max-w-none">
      <h3>About Me</h3>
      <p>{owner.bio ?? "Hi, I build web apps."}</p>
      <ul>
        <li>
          <strong>Title:</strong> {owner.title ?? "Full Stack Developer"}
        </li>
        <li>
          <strong>Location:</strong> {owner.location ?? "—"}
        </li>
        <li>
          <strong>Website:</strong> {owner.website ?? "—"}
        </li>
      </ul>
    </div>
  );
}
