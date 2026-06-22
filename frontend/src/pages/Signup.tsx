import { Link } from "react-router-dom";

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
    return (
        <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Create Account</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    <Label>Name</Label>
                    <Input placeholder="John Doe" />
                </div>

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
                    Sign Up
                </Button>

                <p className="text-center text-sm">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-600"
                    >
                        Login
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}