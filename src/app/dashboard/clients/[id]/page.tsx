import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Tag,
  Star,
  Clock,
  Calendar,
  FileText,
  Plus,
} from "lucide-react";
import Link from "next/link";
import ClientStampCard from "@/components/clients/client-stamp-card";
import ClientAppointmentsList from "@/components/clients/client-appointments-list";
import ClientInvoicesList from "@/components/clients/client-invoices-list";
import ClientPetsList from "@/components/clients/client-pets-list";

export default async function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // First get the session to refresh tokens if needed
  await supabase.auth.getSession();

  // Then get the user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return redirect("/sign-in");
  }

  // Fetch client details
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", params.id)
    .eq("business_id", user.id)
    .single();

  if (clientError || !client) {
    return redirect("/dashboard/clients");
  }

  // Fetch client's pets
  const { data: pets, error: petsError } = await supabase
    .from("pets")
    .select("*")
    .eq("client_id", client.id);

  // Fetch client's stamps
  const { data: clientStamps, error: stampsError } = await supabase
    .from("client_stamps")
    .select("*, reward_programs(*)")
    .eq("client_id", client.id);

  // Fetch reward programs
  const { data: rewardPrograms, error: programsError } = await supabase
    .from("reward_programs")
    .select("*, rewards(*)")
    .eq("business_id", user.id)
    .eq("is_active", true);

  // Fetch client's appointments
  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select("*")
    .eq("client_id", client.id)
    .order("date", { ascending: false })
    .limit(5);

  // Fetch client's invoices
  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select("*")
    .eq("client_id", client.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Format client tags
  const tags = client.tags || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/clients">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Clients
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{client.name}</h1>
          {client.is_vip && (
            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center">
              <Star className="h-3 w-3 mr-1" /> VIP
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/clients/${client.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" /> Edit Client
            </Button>
          </Link>
          <Link href={`/dashboard/appointments/create?client=${client.id}`}>
            <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
              <Plus className="mr-2 h-4 w-4" /> New Appointment
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {client.email && (
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-gray-600">{client.email}</div>
                  </div>
                </div>
              )}

              {client.phone && (
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-gray-600">{client.phone}</div>
                  </div>
                </div>
              )}

              {client.address && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="text-gray-600">{client.address}</div>
                  </div>
                </div>
              )}

              {client.preferred_payment_method && (
                <div className="flex items-start">
                  <CreditCard className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Preferred Payment</div>
                    <div className="text-gray-600 capitalize">
                      {client.preferred_payment_method}
                    </div>
                  </div>
                </div>
              )}

              {tags.length > 0 && (
                <div className="flex items-start">
                  <Tag className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Tags</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium">Client Since</div>
                  <div className="text-gray-600">
                    {new Date(client.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {client.notes && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <h3 className="font-medium mb-2">Notes</h3>
                  <p className="text-gray-600 text-sm">{client.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Loyalty Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Loyalty Program</CardTitle>
            </CardHeader>
            <CardContent>
              {clientStamps && clientStamps.length > 0 ? (
                <div className="space-y-6">
                  {clientStamps.map((stampCard) => (
                    <ClientStampCard
                      key={stampCard.id}
                      clientId={client.id}
                      stampCard={stampCard}
                      rewardProgram={stampCard.reward_programs}
                    />
                  ))}
                </div>
              ) : rewardPrograms && rewardPrograms.length > 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">
                    This client hasn't joined any loyalty programs yet.
                  </p>
                  <Link href={`/dashboard/clients/${client.id}/rewards/enroll`}>
                    <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
                      Enroll in Loyalty Program
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">
                    No loyalty programs have been set up yet.
                  </p>
                  <Link href="/dashboard/settings/loyalty-programs">
                    <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
                      Create Loyalty Program
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Pets, Appointments, Invoices */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="pets" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="pets">Pets ({pets?.length || 0})</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
            </TabsList>

            <TabsContent value="pets" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Pets</CardTitle>
                    <CardDescription>Manage this client's pets</CardDescription>
                  </div>
                  <Link href={`/dashboard/clients/${client.id}/pets/add`}>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" /> Add Pet
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <ClientPetsList pets={pets || []} clientId={client.id} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Appointments</CardTitle>
                    <CardDescription>
                      View and manage client appointments
                    </CardDescription>
                  </div>
                  <Link
                    href={`/dashboard/appointments/create?client=${client.id}`}
                  >
                    <Button size="sm">
                      <Calendar className="mr-2 h-4 w-4" /> Schedule
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <ClientAppointmentsList
                    appointments={appointments || []}
                    clientId={client.id}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Invoices & Payments</CardTitle>
                    <CardDescription>
                      View client invoices and payment history
                    </CardDescription>
                  </div>
                  <Link href={`/dashboard/invoices/create?client=${client.id}`}>
                    <Button size="sm">
                      <FileText className="mr-2 h-4 w-4" /> New Invoice
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <ClientInvoicesList
                    invoices={invoices || []}
                    clientId={client.id}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
