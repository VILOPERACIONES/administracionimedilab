import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServicioInput {
  nombre: string;
  descripcion: string;
}

export const useServicios = () => {
  return useQuery({
    queryKey: ["servicios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("servicios")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Servicio[];
    },
  });
};

export const useCreateServicio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (servicio: ServicioInput) => {
      const { data, error } = await supabase
        .from("servicios")
        .insert([servicio])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicios"] });
      toast.success("Servicio creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(`Error al crear servicio: ${error.message}`);
    },
  });
};

export const useUpdateServicio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...servicio }: ServicioInput & { id: string }) => {
      const { data, error } = await supabase
        .from("servicios")
        .update(servicio)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicios"] });
      toast.success("Servicio actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar servicio: ${error.message}`);
    },
  });
};

export const useDeleteServicio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("servicios")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicios"] });
      toast.success("Servicio eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar servicio: ${error.message}`);
    },
  });
};
