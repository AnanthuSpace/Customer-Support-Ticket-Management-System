import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
    signupSchema,
    type SignupFormData,
} from "@/schemas/auth.schema";

import { registerCustomer, loginUser } from "@/api/auth.api";
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

export default function Signup() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const navigate = useNavigate();
    const { login } = useAuth();

    const onSubmit = async (
        data: SignupFormData
    ) => {
        try {
            await registerCustomer(data);

            const loginResponse = await loginUser({
                email: data.email,
                password: data.password,
            });

            const {
                data: {
                    data: { user, accessToken },
                },
            } = loginResponse;

            login(user, accessToken);
            toast.success("Account created successfully");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Signup failed"
            );
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Create Account</CardTitle>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div>
                        <Label>Name</Label>

                        <Input
                            {...register("name")}
                        />

                        {errors.name && (
                            <p className="text-red-500 text-sm">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

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
                            ? "Creating..."
                            : "Sign Up"}
                    </Button>

                    <p className="text-center text-sm">
                        Already have an account?
                        <Link
                            to="/login"
                            className="text-blue-600 ml-1"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}