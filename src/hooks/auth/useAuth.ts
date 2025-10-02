import { login, logout } from "@/lib/api";
import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

//TODO: GEÇİCİ ÇÖZÜM
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { username: string; password: string }) => login(data),
    onSuccess: async (data) => {
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);

        // users/me çağrısı TODO: BU KISIM DEĞİŞECEK
        try {
          const res = await axiosInstance.get("/users/me", {
            headers: {
              Authorization: `Bearer ${data.accessToken}`,
            },
          });
          const user = await res.data;
          queryClient.setQueryData(["user"], user);

          // Rol bazlı yönlendirme
          if (user.role === "CUSTOMERUSER") {
            window.location.href = "/client";
          } else {
            window.location.href = "/";
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      queryClient.clear();
    },
    onError: () => {
      // Hata durumunda da cache'i temizle
      queryClient.clear();
    },
  });
};

// hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await axiosInstance.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
