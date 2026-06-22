import { Link } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Login() {
    return (
        <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Login</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    <Label>Email</Label>
                    <Input
                        type="email"
                        placeholder="john@example.com"
                    />
                </div>

                <div>
                    <Label>Password</Label>
                    <Input
                        type="password"
                        placeholder="********"
                    />
                </div>

                <Button className="w-full">
                    Login
                </Button>

                <p className="text-center text-sm">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-blue-600"
                    >
                        Sign Up
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}