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
import { Plus, Pencil, Trash2, Search, Package, Check, X, PlusCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { useCategorias, useCreateCategoria } from "@/hooks/useCategorias";
import { usePaquetes, useCreatePaquete, useUpdatePaquete, useDeletePaquete } from "@/hooks/usePaquetes";

const Paquetes = () => {
  const { data: categorias = [], isLoading: loadingCategorias } = useCategorias();
  const { data: paquetes = [], isLoading: loadingPaquetes } = usePaquetes();
  const createCategoria = useCreateCategoria();
  const createPaquete = useCreatePaquete();
  const updatePaquete = useUpdatePaquete();
  const deletePaquete = useDeletePaquete();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    categoria_id: "",
    precio: "",
    incluye: [] as string[],
  });
  const [newItem, setNewItem] = useState("");
  const [newCategoria, setNewCategoria] = useState("");
  const [isAddingCategoria, setIsAddingCategoria] = useState(false);

  const handleAddCategoria = async () => {
    if (newCategoria.trim()) {
      const result = await createCategoria.mutateAsync(newCategoria.trim());
      setFormData({ ...formData, categoria_id: result.id });
      setNewCategoria("");
      setIsAddingCategoria(false);
    }
  };

  const filteredPaquetes = paquetes.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.categoria?.nombre && p.categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenDialog = (paquete?: typeof paquetes[0]) => {
    if (paquete) {
      setEditingId(paquete.id);
      setFormData({
        nombre: paquete.nombre,
        categoria_id: paquete.categoria_id || "",
        precio: paquete.precio.toString(),
        incluye: [...(paquete.incluye || [])],
      });
    } else {
      setEditingId(null);
      setFormData({ nombre: "", categoria_id: "", precio: "", incluye: [] });
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

  const handleSave = async () => {
    if (!formData.nombre.trim() || !formData.categoria_id || !formData.precio) {
      return;
    }

    const paqueteData = {
      nombre: formData.nombre,
      categoria_id: formData.categoria_id || null,
      precio: Number(formData.precio),
      incluye: formData.incluye,
    };

    if (editingId) {
      await updatePaquete.mutateAsync({ id: editingId, ...paqueteData });
    } else {
      await createPaquete.mutateAsync(paqueteData);
    }

    setIsDialogOpen(false);
    setFormData({ nombre: "", categoria_id: "", precio: "", incluye: [] });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await deletePaquete.mutateAsync(id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  };

  if (loadingPaquetes || loadingCategorias) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

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
                  {editingId ? "Editar Paquete" : "Nuevo Paquete"}
                </DialogTitle>
                <DialogDescription>
                  {editingId
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
                      value={formData.categoria_id}
                      onValueChange={(value) => {
                        if (value === "__add_new__") {
                          setIsAddingCategoria(true);
                        } else {
                          setFormData({ ...formData, categoria_id: value });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.nombre}
                          </SelectItem>
                        ))}
                        <SelectItem value="__add_new__" className="text-primary">
                          <div className="flex items-center gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Añadir nueva categoría
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Dialog open={isAddingCategoria} onOpenChange={(open) => {
                      setIsAddingCategoria(open);
                      if (!open) setNewCategoria("");
                    }}>
                      <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                          <DialogTitle>Nueva Categoría</DialogTitle>
                          <DialogDescription>
                            Añade una nueva categoría para los paquetes
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 py-2">
                          <Label>Nombre de la categoría</Label>
                          <Input
                            placeholder="Ej: Laboratorio"
                            value={newCategoria}
                            onChange={(e) => setNewCategoria(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddCategoria()}
                            autoFocus
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsAddingCategoria(false);
                              setNewCategoria("");
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            onClick={handleAddCategoria}
                            disabled={createCategoria.isPending || !newCategoria.trim()}
                          >
                            {createCategoria.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Añadir
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
                <Button 
                  onClick={handleSave}
                  disabled={createPaquete.isPending || updatePaquete.isPending}
                >
                  {(createPaquete.isPending || updatePaquete.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingId ? "Guardar Cambios" : "Crear Paquete"}
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
                        {paquete.categoria?.nombre || "Sin categoría"}
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
                        disabled={deletePaquete.isPending}
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
                      {(paquete.incluye || []).map((item, index) => (
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
