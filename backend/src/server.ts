import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedAdmin } from "./seedAdmin.js";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await connectDB();
        await seedAdmin();

        const server = app.listen(PORT, () => {
            console.log(
                `Server running on port ${PORT}`
            );
            console.log(
                `API Docs: http://localhost:${PORT}/api-docs`
            );
        });

        process.on(
            "unhandledRejection",
            (err: Error) => {
                console.error(err);

                server.close(() =>
                    process.exit(1)
                );
            }
        );
    } catch (error) {
        console.error(
            "Server startup failed:"
        );
        console.error(error);
        process.exit(1);
    }
};

process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION");
    console.error(err);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION");
    console.error(err);
});

startServer();