const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerClient, loginClient } = require("../controllers/authController");
const Client = require("../models/Client");

jest.mock("../models/Client"); // Mockeamos el modelo Client
jest.mock("bcryptjs"); // Mockeamos bcrypt
jest.mock("jsonwebtoken"); // Mockeamos JWT

const mockRequest = (body) => ({ body });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Auth Controller", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada test
  });

  // 📌 PRUEBA: Registro exitoso de cliente
  test("Debe registrar un cliente y devolver un token", async () => {
    const req = mockRequest({
      name: "Alisson",
      lastname: "Ortega",
      ID_number: "12345678",
      email: "test@example.com",
      password: "securePass123",
      phone: "3001234567",
    });
    const res = mockResponse();

    Client.findOne.mockResolvedValue(null); // Simula que no existe el usuario
    bcrypt.hash.mockResolvedValue("hashedPassword123"); // Simula hash de contraseña
    Client.create.mockResolvedValue({
      id: 1,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });
    jwt.sign.mockReturnValue("mockedToken"); // Simula un JWT

    await registerClient(req, res);

    expect(Client.findOne).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
    expect(Client.create).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Cliente registrado exitosamente",
        client: expect.any(Object),
        token: "mockedToken",
      })
    );
  });

  // 📌 PRUEBA: Cliente ya registrado
  test("Debe devolver error si el cliente ya existe", async () => {
    const req = mockRequest({
      name: "Alisson",
      lastname: "Ortega",
      ID_number: "12345678",
      email: "test@example.com",
      password: "securePass123",
      phone: "3001234567",
    });
    const res = mockResponse();

    Client.findOne.mockResolvedValue({ id: 1, email: req.body.email });

    await registerClient(req, res);

    expect(Client.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Cliente ya registrado" });
  });

  // 📌 PRUEBA: Inicio de sesión exitoso
  test("Debe iniciar sesión y devolver un token", async () => {
    const req = mockRequest({ email: "test@example.com", password: "securePass123" });
    const res = mockResponse();

    Client.findOne.mockResolvedValue({
      id: 1,
      name: "Alisson",
      email: req.body.email,
      password: "hashedPassword123",
    });
    bcrypt.compare.mockResolvedValue(true); // Simula comparación de contraseña correcta
    jwt.sign.mockReturnValue("mockedToken"); // Simula JWT

    await loginClient(req, res);

    expect(Client.findOne).toHaveBeenCalled();
    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, "hashedPassword123");
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Inicio de sesión exitoso",
        client: expect.any(Object),
        token: "mockedToken",
      })
    );
  });

  // 📌 PRUEBA: Error en inicio de sesión (contraseña incorrecta)
  test("Debe devolver error si la contraseña es incorrecta", async () => {
    const req = mockRequest({ email: "test@example.com", password: "wrongPass" });
    const res = mockResponse();

    Client.findOne.mockResolvedValue({ email: req.body.email, password: "hashedPassword123" });
    bcrypt.compare.mockResolvedValue(false); // Simula comparación de contraseña incorrecta

    await loginClient(req, res);

    expect(Client.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Correo electrónico o contraseña incorrectos" });
  });

  // 📌 PRUEBA: Error interno en el servidor
  test("Debe manejar errores internos en el registro", async () => {
    const req = mockRequest({
      name: "Alisson",
      lastname: "Ortega",
      ID_number: "12345678",
      email: "test@example.com",
      password: "securePass123",
      phone: "3001234567",
    });
    const res = mockResponse();

    Client.findOne.mockRejectedValue(new Error("Database error")); // Simula un error de BD

    await registerClient(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Error al registrar el cliente" })
    );
  });
});

