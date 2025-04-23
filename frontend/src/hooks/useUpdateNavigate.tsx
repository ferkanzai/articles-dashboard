import { useNavigate } from "@tanstack/react-router";

const useUpdateNavigate = () => {
  const navigate = useNavigate({ from: "/" });

  return {
    navigate: (updates: Record<string, string | number | undefined>) => {
      navigate({
        search: (old) => ({
          ...old,
          ...updates,
        }),
        replace: true,
        resetScroll: false,
      });
    },
  };
};

export { useUpdateNavigate };
