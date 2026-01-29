import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, Package } from "lucide-react";

const stats = [
  {
    title: "Total Servicios",
    value: "24",
    icon: FlaskConical,
    description: "Servicios activos",
  },
  {
    title: "Total Paquetes",
    value: "12",
    icon: Package,
    description: "Paquetes disponibles",
  },
];

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido al panel de administración de IMEDILAB
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer">
                <FlaskConical className="h-5 w-5 text-primary" />
                <span className="font-medium">Agregar nuevo servicio</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer">
                <Package className="h-5 w-5 text-primary" />
                <span className="font-medium">Crear paquete</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Servicio actualizado", item: "Hemograma Completo", time: "Hace 2 horas" },
                  { action: "Paquete creado", item: "Chequeo Ejecutivo", time: "Hace 5 horas" },
                  { action: "Servicio agregado", item: "Prueba COVID-19", time: "Ayer" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.item}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
