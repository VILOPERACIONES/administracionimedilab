import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Categoria {
  id: string;
  nombre: string;
  created_at: string;
  updated_at: string;
}

export const useCategorias = () => {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("nombre", { ascending: true });
      
      if (error) throw error;
      return data as Categoria[];
    },
  });
};

export const useCreateCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nombre: string) => {
      const { data, error } = await supabase
        .from("categorias")
        .insert([{ nombre }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Categoria;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoría creada correctamente");
    },
    onError: (error: Error) => {
      if (error.message.includes("duplicate")) {
        toast.error("Esta categoría ya existe");
      } else {
        toast.error(`Error al crear categoría: ${error.message}`);
      }
    },
  });
};
