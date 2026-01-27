import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search, FlaskConical } from "lucide-react";
import { toast } from "sonner";

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
}

const initialServicios: Servicio[] = [
  { id: 1, nombre: "Hemograma Completo", descripcion: "Análisis de sangre que mide glóbulos rojos, blancos y plaquetas." },
  { id: 2, nombre: "Química Sanguínea", descripcion: "Evaluación de glucosa, colesterol, triglicéridos y más." },
  { id: 3, nombre: "Examen General de Orina", descripcion: "Análisis físico, químico y microscópico de la orina." },
  { id: 4, nombre: "Prueba de COVID-19 PCR", descripcion: "Detección molecular del virus SARS-CoV-2." },
  { id: 5, nombre: "Perfil Tiroideo", descripcion: "Medición de hormonas T3, T4 y TSH." },
];

const Servicios = () => {
  const [servicios, setServicios] = useState<Servicio[]>(initialServicios);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });

  const filteredServicios = servicios.filter(
    (s) =>
      s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (servicio?: Servicio) => {
    if (servicio) {
      setEditingServicio(servicio);
      setFormData({ nombre: servicio.nombre, descripcion: servicio.descripcion });
    } else {
      setEditingServicio(null);
      setFormData({ nombre: "", descripcion: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nombre.trim()) {
      toast.error("El nombre del servicio es requerido");
      return;
    }

    if (editingServicio) {
      setServicios(
        servicios.map((s) =>
          s.id === editingServicio.id ? { ...s, ...formData } : s
        )
      );
      toast.success("Servicio actualizado correctamente");
    } else {
      const newServicio: Servicio = {
        id: Math.max(...servicios.map((s) => s.id)) + 1,
        ...formData,
      };
      setServicios([...servicios, newServicio]);
      toast.success("Servicio creado correctamente");
    }

    setIsDialogOpen(false);
    setFormData({ nombre: "", descripcion: "" });
    setEditingServicio(null);
  };

  const handleDelete = (id: number) => {
    setServicios(servicios.filter((s) => s.id !== id));
    toast.success("Servicio eliminado correctamente");
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Servicios</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona los servicios del laboratorio
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Servicio
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingServicio ? "Editar Servicio" : "Nuevo Servicio"}
                </DialogTitle>
                <DialogDescription>
                  {editingServicio
                    ? "Modifica los datos del servicio"
                    : "Agrega un nuevo servicio al catálogo"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del servicio</Label>
                  <Input
                    id="nombre"
                    placeholder="Ej: Hemograma Completo"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Descripción detallada del servicio..."
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  {editingServicio ? "Guardar Cambios" : "Crear Servicio"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {filteredServicios.length} servicio(s)
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Servicio</TableHead>
                    <TableHead className="font-semibold hidden sm:table-cell">
                      Descripción
                    </TableHead>
                    <TableHead className="font-semibold text-right w-[100px]">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServicios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        <FlaskConical className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-muted-foreground">
                          No se encontraron servicios
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredServicios.map((servicio) => (
                      <TableRow key={servicio.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">
                              {servicio.nombre}
                            </p>
                            <p className="text-sm text-muted-foreground sm:hidden mt-1">
                              {servicio.descripcion}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {servicio.descripcion}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(servicio)}
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(servicio.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Servicios;
