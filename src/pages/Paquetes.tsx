import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, Package, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Paquete {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  incluye: string[];
}

const categorias = [
  "Chequeos Generales",
  "Cardiología",
  "Ginecología",
  "Pediatría",
  "Preventivo",
];

const initialPaquetes: Paquete[] = [
  {
    id: 1,
    nombre: "Chequeo Básico",
    categoria: "Chequeos Generales",
    precio: 850,
    incluye: ["Hemograma Completo", "Química Sanguínea 6 elementos", "Examen General de Orina"],
  },
  {
    id: 2,
    nombre: "Chequeo Ejecutivo",
    categoria: "Preventivo",
    precio: 2500,
    incluye: ["Hemograma Completo", "Química Sanguínea 35 elementos", "Perfil Tiroideo", "Electrocardiograma", "Radiografía de Tórax"],
  },
  {
    id: 3,
    nombre: "Perfil Cardiaco",
    categoria: "Cardiología",
    precio: 1800,
    incluye: ["Electrocardiograma", "Enzimas Cardiacas", "Perfil de Lípidos", "BNP"],
  },
  {
    id: 4,
    nombre: "Control Prenatal",
    categoria: "Ginecología",
    precio: 1200,
    incluye: ["Hemograma", "Grupo Sanguíneo y RH", "VDRL", "VIH", "Examen General de Orina"],
  },
];

const Paquetes = () => {
  const [paquetes, setPaquetes] = useState<Paquete[]>(initialPaquetes);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPaquete, setEditingPaquete] = useState<Paquete | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    incluye: [] as string[],
  });
  const [newItem, setNewItem] = useState("");

  const filteredPaquetes = paquetes.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (paquete?: Paquete) => {
    if (paquete) {
      setEditingPaquete(paquete);
      setFormData({
        nombre: paquete.nombre,
        categoria: paquete.categoria,
        precio: paquete.precio.toString(),
        incluye: [...paquete.incluye],
      });
    } else {
      setEditingPaquete(null);
      setFormData({ nombre: "", categoria: "", precio: "", incluye: [] });
    }
    setNewItem("");
    setIsDialogOpen(true);
  };

  const handleAddItem = () => {
    if (newItem.trim() && !formData.incluye.includes(newItem.trim())) {
      setFormData({
        ...formData,
        incluye: [...formData.incluye, newItem.trim()],
      });
      setNewItem("");
    }
  };

  const handleRemoveItem = (item: string) => {
    setFormData({
      ...formData,
      incluye: formData.incluye.filter((i) => i !== item),
    });
  };

  const handleSave = () => {
    if (!formData.nombre.trim()) {
      toast.error("El nombre del paquete es requerido");
      return;
    }
    if (!formData.categoria) {
      toast.error("Selecciona una categoría");
      return;
    }
    if (!formData.precio || isNaN(Number(formData.precio))) {
      toast.error("Ingresa un precio válido");
      return;
    }

    const paqueteData = {
      nombre: formData.nombre,
      categoria: formData.categoria,
      precio: Number(formData.precio),
      incluye: formData.incluye,
    };

    if (editingPaquete) {
      setPaquetes(
        paquetes.map((p) =>
          p.id === editingPaquete.id ? { ...p, ...paqueteData } : p
        )
      );
      toast.success("Paquete actualizado correctamente");
    } else {
      const newPaquete: Paquete = {
        id: Math.max(...paquetes.map((p) => p.id)) + 1,
        ...paqueteData,
      };
      setPaquetes([...paquetes, newPaquete]);
      toast.success("Paquete creado correctamente");
    }

    setIsDialogOpen(false);
    setFormData({ nombre: "", categoria: "", precio: "", incluye: [] });
    setEditingPaquete(null);
  };

  const handleDelete = (id: number) => {
    setPaquetes(paquetes.filter((p) => p.id !== id));
    toast.success("Paquete eliminado correctamente");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Paquetes</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona los paquetes de servicios
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Paquete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPaquete ? "Editar Paquete" : "Nuevo Paquete"}
                </DialogTitle>
                <DialogDescription>
                  {editingPaquete
                    ? "Modifica los datos del paquete"
                    : "Crea un nuevo paquete de servicios"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del paquete</Label>
                  <Input
                    id="nombre"
                    placeholder="Ej: Chequeo Ejecutivo"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoría</Label>
                    <Select
                      value={formData.categoria}
                      onValueChange={(value) =>
                        setFormData({ ...formData, categoria: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio (MXN)</Label>
                    <Input
                      id="precio"
                      type="number"
                      placeholder="0.00"
                      value={formData.precio}
                      onChange={(e) =>
                        setFormData({ ...formData, precio: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Incluye (Viñetas)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Agregar servicio incluido..."
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem())}
                    />
                    <Button type="button" onClick={handleAddItem} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.incluye.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.incluye.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-muted rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span className="text-sm">{item}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleRemoveItem(item)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  {editingPaquete ? "Guardar Cambios" : "Crear Paquete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border/50 mb-6">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar paquetes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {filteredPaquetes.length} paquete(s)
              </span>
            </div>
          </CardHeader>
        </Card>

        {filteredPaquetes.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No se encontraron paquetes</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaquetes.map((paquete) => (
              <Card
                key={paquete.id}
                className="border-border/50 hover:shadow-md transition-shadow group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {paquete.categoria}
                      </Badge>
                      <h3 className="font-semibold text-lg text-foreground">
                        {paquete.nombre}
                      </h3>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(paquete)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(paquete.id)}
                        className="h-8 w-8 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary mb-4">
                    {formatPrice(paquete.precio)}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Incluye:</p>
                    <ul className="space-y-1.5">
                      {paquete.incluye.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Paquetes;
