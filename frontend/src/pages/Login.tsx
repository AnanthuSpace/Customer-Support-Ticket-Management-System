import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { loginSchema, type LoginFormData } from "@/schemas/auth.schema";
import { loginUser } from "@/api/auth.api";
import { useAuth } from "../context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const navigate = useNavigate();
    const { login } = useAuth();

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await loginUser(data);

            const {
                data: {
                    data: { user, accessToken },
                },
            } = response;

            const normalizedUser = {
                id: user._id ?? user.id ?? user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
            };

            login(normalizedUser, accessToken);
            toast.success("Login successful");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Login</CardTitle>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div>
                        <Label>Email</Label>

                        <Input
                            {...register("email")}
                            type="email"
                        />

                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Password</Label>

                        <Input
                            {...register("password")}
                            type="password"
                        />

                        {errors.password && (
                            <p className="text-red-500 text-sm">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting
                            ? "Logging in..."
                            : "Login"}
                    </Button>

                    <p className="text-center text-sm">
                        Don't have an account?
                        <Link
                            to="/signup"
                            className="text-blue-600 ml-1"
                        >
                            Sign Up
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}