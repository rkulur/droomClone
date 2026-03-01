// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

export async function submitListing(
  data: Record<string, unknown>
): Promise<{ id: string; slug: string }> {
  const response = await fetch("/api/vehicles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? "Submission failed");
  }

  return {
    id: json._id,
    slug: json.slug,
  };
}
