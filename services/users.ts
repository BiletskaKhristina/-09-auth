export const getUser = async () => {
  const res = await fetch("/api/users/me");
  return res.json();
};