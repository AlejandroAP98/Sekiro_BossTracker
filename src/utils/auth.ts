export const saveUsername = (username: string) => {
  localStorage.setItem('sekiro_username', username);
};

export const getUsername = (): string | null => {
  return localStorage.getItem('sekiro_username');
};

export const clearUsername = () => {
  localStorage.removeItem('sekiro_username');
};
