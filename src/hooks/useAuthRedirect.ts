import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export const useAuthRedirect = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const requireAuth = (
    action: () => void,
    redirectPath: string = "/auth/sign-in"
  ) => {
    if (!isAuthenticated) {
      router.push(redirectPath);
      return;
    }
    action();
  };

  return { requireAuth };
};
