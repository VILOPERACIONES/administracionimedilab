-- Tabla de categorías
CREATE TABLE public.categorias (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de servicios
CREATE TABLE public.servicios (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de paquetes
CREATE TABLE public.paquetes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
    precio DECIMAL(10,2) NOT NULL DEFAULT 0,
    incluye TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paquetes ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de LECTURA (para que el Landing pueda leer)
CREATE POLICY "Categorias son públicas para lectura" 
ON public.categorias 
FOR SELECT 
USING (true);

CREATE POLICY "Servicios son públicos para lectura" 
ON public.servicios 
FOR SELECT 
USING (true);

CREATE POLICY "Paquetes son públicos para lectura" 
ON public.paquetes 
FOR SELECT 
USING (true);

-- Políticas de ESCRITURA solo para usuarios autenticados (admins)
CREATE POLICY "Solo admins pueden insertar categorias" 
ON public.categorias 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Solo admins pueden actualizar categorias" 
ON public.categorias 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Solo admins pueden eliminar categorias" 
ON public.categorias 
FOR DELETE 
TO authenticated
USING (true);

CREATE POLICY "Solo admins pueden insertar servicios" 
ON public.servicios 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Solo admins pueden actualizar servicios" 
ON public.servicios 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Solo admins pueden eliminar servicios" 
ON public.servicios 
FOR DELETE 
TO authenticated
USING (true);

CREATE POLICY "Solo admins pueden insertar paquetes" 
ON public.paquetes 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Solo admins pueden actualizar paquetes" 
ON public.paquetes 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Solo admins pueden eliminar paquetes" 
ON public.paquetes 
FOR DELETE 
TO authenticated
USING (true);

-- Función para actualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para timestamps
CREATE TRIGGER update_categorias_updated_at
BEFORE UPDATE ON public.categorias
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_servicios_updated_at
BEFORE UPDATE ON public.servicios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_paquetes_updated_at
BEFORE UPDATE ON public.paquetes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar categorías iniciales
INSERT INTO public.categorias (nombre) VALUES 
('Laboratorio'),
('Gabinete'),
('Especialidades'),
('Preventivo');