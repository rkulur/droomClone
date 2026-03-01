// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

type FieldErrorProps = {
  message?: string;
};

const FieldError = ({ message }: FieldErrorProps) => {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-destructive mt-1">{message}</p>;
};

export default FieldError;
