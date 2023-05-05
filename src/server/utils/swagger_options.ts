const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Budget-Manager API",
      version: "1.0.0",
      description: "API for Budget-Manager",
      contact: {
        name: "Varnit Sinha",
        url: "https://www.varnitsinha.com",
        email: "varnits02@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5555",
      },
    ],
  },
  apis: ["./src/routes/*/*.ts", "./dist/routes/*/*.js"],
};

export default swaggerOptions;
