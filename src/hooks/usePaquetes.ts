import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Paquete {
  id: string;
  nombre: string;
  categoria_id: string | null;
  precio: number;
  incluye: string[];
  created_at: string;
  updated_at: string;
  categoria?: {
    id: string;
    nombre: string;
  } | null;
}

export interface PaqueteInput {
  nombre: string;
  categoria_id: string | null;
  precio: number;
  incluye: string[];
}

export const usePaquetes = () => {
  return useQuery({
    queryKey: ["paquetes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("paquetes")
        .select(`
          *,
          categoria:categorias(id, nombre)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Paquete[];
    },
  });
};

export const useCreatePaquete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paquete: PaqueteInput) => {
      const { data, error } = await supabase
        .from("paquetes")
        .insert([paquete])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paquetes"] });
      toast.success("Paquete creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(`Error al crear paquete: ${error.message}`);
    },
  });
};

export const useUpdatePaquete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...paquete }: PaqueteInput & { id: string }) => {
      const { data, error } = await supabase
        .from("paquetes")
        .update(paquete)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paquetes"] });
      toast.success("Paquete actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar paquete: ${error.message}`);
    },
  });
};

export const useDeletePaquete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("paquetes")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paquetes"] });
      toast.success("Paquete eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar paquete: ${error.message}`);
    },
  });
};
