"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoUpload } from "@/components/admin/logo-upload";
import { slugify } from "@/lib/validations/company";
import { toast } from "sonner";

interface Company {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  website: string | null;
  _count?: { jobs: number };
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then((d) => setCompanies(d.companies || []));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slugify(name),
          description,
          website,
          logo,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCompanies((prev) => [...prev, data.company]);
      setName("");
      setDescription("");
      setWebsite("");
      setLogo("");
      toast.success("Company created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Manage Companies</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add Company</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4 max-w-md">
            <div>
              <Label>Company Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label>Logo</Label>
              <LogoUpload value={logo} onChange={setLogo} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Website</Label>
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} type="url" className="mt-1" />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Company"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {companies.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                {c.logo ? (
                  <Image src={c.logo} alt={c.name} width={48} height={48} className="object-contain p-1" />
                ) : (
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c._count?.jobs ?? 0} jobs
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
