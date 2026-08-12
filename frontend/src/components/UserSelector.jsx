export default function UserSelector({ users, selectedUserId, onChange, disabled }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">Select a user</span>
      <select
        value={selectedUserId}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || users.length === 0}
        className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-muted"
      >
        {users.length === 0 ? (
          <option value="">No users available</option>
        ) : (
          users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))
        )}
      </select>
    </label>
  );
}
