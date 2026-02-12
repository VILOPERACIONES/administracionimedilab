import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const servicioInputSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es requerido").max(200, "Máximo 200 caracteres"),
  descripcion: z.string().trim().max(1000, "Máximo 1000 caracteres"),
});

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
      const validated = servicioInputSchema.parse(servicio) as ServicioInput;
      const { data, error } = await supabase
        .from("servicios")
        .insert([validated])
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
      const validated = servicioInputSchema.parse(servicio) as ServicioInput;
      const { data, error } = await supabase
        .from("servicios")
        .update(validated)
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
