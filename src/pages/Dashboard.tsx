import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, Package, Loader2 } from "lucide-react";
import { useServicios } from "@/hooks/useServicios";
import { usePaquetes } from "@/hooks/usePaquetes";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: servicios = [], isLoading: loadingServicios } = useServicios();
  const { data: paquetes = [], isLoading: loadingPaquetes } = usePaquetes();

  const stats = [
    {
      title: "Total Servicios",
      value: servicios.length.toString(),
      icon: FlaskConical,
      description: "Servicios registrados",
    },
    {
      title: "Total Paquetes",
      value: paquetes.length.toString(),
      icon: Package,
      description: "Paquetes disponibles",
    },
  ];

  const isLoading = loadingServicios || loadingPaquetes;

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido al panel de administración de IMEDILAB
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <Card 
                key={stat.title} 
                className="border-border/50 hover:shadow-md transition-shadow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button 
                onClick={() => navigate("/servicios")}
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer w-full text-left"
              >
                <FlaskConical className="h-5 w-5 text-primary" />
                <span className="font-medium">Agregar nuevo servicio</span>
              </button>
              <button 
                onClick={() => navigate("/paquetes")}
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer w-full text-left"
              >
                <Package className="h-5 w-5 text-primary" />
                <span className="font-medium">Crear paquete</span>
              </button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Resumen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <p className="text-muted-foreground">Servicios activos</p>
                  <p className="font-semibold text-foreground">{servicios.length}</p>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <p className="text-muted-foreground">Paquetes creados</p>
                  <p className="font-semibold text-foreground">{paquetes.length}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-muted-foreground">Estado del sistema</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Operativo
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
