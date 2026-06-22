import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title:
                "Support Ticket API",

            version: "1.0.0",
        },

        servers: [
            {
                url:
                    "http://localhost:8000",
            },
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },

    apis: ["./src/**/*.ts"],
};

export const specs =
    swaggerJsDoc(options);

export const swaggerDocs =
    (app: any) => {
        app.use(
            "/api-docs",
            swaggerUi.serve,
            swaggerUi.setup(specs)
        );
    };