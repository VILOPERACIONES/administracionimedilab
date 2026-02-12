
-- 1. Create role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can read roles (and their own)
CREATE POLICY "Users can read their own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 3. Insert existing admin users
INSERT INTO public.user_roles (user_id, role) VALUES
  ('ae6be9a3-dc71-464a-be5d-0d94558cfd66', 'admin'),
  ('69f77aba-5c33-45cd-bc4e-cf39cb93c633', 'admin');

-- 4. Drop all permissive write policies and recreate with admin check

-- CATEGORIAS
DROP POLICY "Solo admins pueden insertar categorias" ON public.categorias;
CREATE POLICY "Solo admins pueden insertar categorias"
ON public.categorias FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Solo admins pueden actualizar categorias" ON public.categorias;
CREATE POLICY "Solo admins pueden actualizar categorias"
ON public.categorias FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Solo admins pueden eliminar categorias" ON public.categorias;
CREATE POLICY "Solo admins pueden eliminar categorias"
ON public.categorias FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- SERVICIOS
DROP POLICY "Solo admins pueden insertar servicios" ON public.servicios;
CREATE POLICY "Solo admins pueden insertar servicios"
ON public.servicios FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Solo admins pueden actualizar servicios" ON public.servicios;
CREATE POLICY "Solo admins pueden actualizar servicios"
ON public.servicios FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Solo admins pueden eliminar servicios" ON public.servicios;
CREATE POLICY "Solo admins pueden eliminar servicios"
ON public.servicios FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- PAQUETES
DROP POLICY "Solo admins pueden insertar paquetes" ON public.paquetes;
CREATE POLICY "Solo admins pueden insertar paquetes"
ON public.paquetes FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Solo admins pueden actualizar paquetes" ON public.paquetes;
CREATE POLICY "Solo admins pueden actualizar paquetes"
ON public.paquetes FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Solo admins pueden eliminar paquetes" ON public.paquetes;
CREATE POLICY "Solo admins pueden eliminar paquetes"
ON public.paquetes FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
