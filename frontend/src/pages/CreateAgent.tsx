import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { createAgent } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const createAgentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["agent", "customer"]).default("agent"),
});

type CreateAgentFormData = z.infer<typeof createAgentSchema>;

export default function CreateAgent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAgentFormData>({
    resolver: zodResolver(createAgentSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: CreateAgentFormData) => {
    console.log("CreateAgent submit", data);
    try {
      const response = await createAgent(data);
      console.log("createAgent response", response);
      toast.success("Agent created successfully");
      navigate("/users");
    } catch (error: any) {
      console.error("createAgent error", error?.response || error);
      const serverMessage = error?.response?.data?.message;
      const validationErrors = error?.response?.data?.errors;

      if (validationErrors && Array.isArray(validationErrors)) {
        validationErrors.forEach((e: any) => toast.error(e.message || JSON.stringify(e)));
        return;
      }

      toast.error(serverMessage || "Failed to create agent");
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Agent</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Name</Label>
            <Input type="text" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label>Email</Label>
            <Input type="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label>Password</Label>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Label>Role</Label>
            <select
              {...register("role")}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
            >
              <option value="agent">Agent</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
