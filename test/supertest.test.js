import chai from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import config from "../src/config/config.js";

const expect = chai.expect;
const requester = supertest(app); // Usa tu aplicación en lugar de 'http://localhost:8080'

describe("Testing general de la app", () => {
  // // Prueba para la ruta "Obtener todos los productos"
  describe("Obtener todos los productos", () => {
    it("debe devolver una lista de productos, endpoint: /api/products", async function () {
      this.timeout(5000);
      const response = await requester.get("/api/products");

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("object");
      // Puedes agregar más expectativas según el formato de respuesta esperado
    });
  });

  // // Prueba para la ruta "Obtener un producto"
  describe("Obtener un producto", () => {
    // Establece un timeout de 5000 ms (5 segundos) para esta prueba

    it("debe devolver un producto específico, endpoint: /api/products/:id", async function () {
      // Reemplaza ':id' con un ID válido de un producto existente en tu base de datos
      this.timeout(5000);
      const productId = "64c7c0806586c53722e922d6";

      const response = await requester.get(`/api/products/${productId}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("object");
      // Puedes agregar más expectativas según el formato de respuesta esperado
    });
  });

  // // Prueba para la ruta "Eliminar un producto"
  // // describe("Eliminar un producto", function () {
  // //   this.timeout(5000);

  // //   it("debe eliminar un producto, endpoint: /api/products/:id", async function () {
  // //     const user = {
  // //       email: config.users.USER_ADMIN,
  // //       password: config.users.PASS_PASS,
  // //       role: "Admin",
  // //     };

  // //     const login = await requester.post("/api/session/login").send(user);

  // //     const { header } = login;

  // //     expect(header["set-cookie"]).to.be.ok;

  // //     const productId = "64c7c0806586c53722e922d6";

  // //     const response = await requester
  // //       .delete(`/api/products/${productId}`)
  // //       .set("Cookie", header["set-cookie"]);

  // //     const { status } = response;

  // //     expect(status).to.equal(204);
  // //   });
  // // });

  // //  CARRITO

  describe("Pruebas para las rutas de carritos", () => {
    let cartId; // Variable para almacenar el ID del carrito creado en la prueba

    // Prueba para crear un carrito
    it("debería crear un nuevo carrito y devolver un ID", async function () {
      this.timeout(5000); // Timeout de 5000ms

      return requester.post("/api/carts").then((response) => {
        expect(response.status).to.equal(201); // 201 indica que se creó con éxito

        // Guarda el ID del carrito creado para usarlo en las siguientes pruebas
        cartId = response.body.payload;
      });
    });

    // Prueba para obtener un carrito por ID
    it("debería obtener un carrito específico por su ID", async function () {
      this.timeout(5000); // Timeout de 5000ms

      return requester
        .get(`/api/carts/${cartId}`)
        .then((response) => {
          expect(response.status).to.equal(200); // 200 indica éxito en la obtención
          expect(response.body).to.be.an("object");
        });
    });

    // // Prueba para agregar un producto a un carrito
    it("debería agregar un producto a un carrito específico", async function () {
      this.timeout(5000); // Timeout de 5000ms

      const productId = "64c7c0806586c53722e922d6"; // Reemplaza con un ID de producto válido
      const quantity = 2; // Cantidad de productos a agregar

      return requester
        .post(`/api/carts/${cartId}/product/${productId}`)
        .send({ quantity })
        .then((response) => {
          expect(response.status).to.equal(200);
        });
    });
  });

  // SESIONES

  describe("Ruta de registro", async function(done) {
    this.timeout(5000); // Timeout de 5000ms
    it("debería registrar un usuario correctamente", () => {
      const newUser = {
        first_name: "nombre",
        last_name: "apellido",
        email: 'emailPrueba2@email.com',
        age: 56,
        password:'contraseña',
        role:'Usuario'
      };

      requester
      .post("/api/session/register")
      .send(newUser)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).to.have.property("message").to.equal("Registro exitoso");
        done()
      });

    });
  });

  describe("Ruta de inicio de sesión", async function () {
    this.timeout(5000); // Timeout de 5000ms
    it("debería iniciar sesión con éxito", () => {
      const credentials = {
        username: "emailPrueba2@email.com",
        password: "contraseña",
      };

      requester.post("/api/session/login").send(credentials).expect(200); // Cambia esto según tu código de respuesta de éxito
    });
  });

  describe("Ruta de cierre de sesión", () => {
    it("debería cerrar la sesión del usuario", () => {
      requester.post("/api/session/logout").expect(200);
    });
  });
});
