export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "customer" | "admin";
}

// REGISTRO DE USUARIO (signUp)
export async function signUp(email: string, password: string, fullName: string): Promise<User> {
  const response = await fetch("http://localhost:5000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,            // El backend debe recibir y hashear el password
      full_name: fullName,
      role: "customer"
    }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "No se pudo registrar el usuario");
  }
  const user = await response.json();
  // El backend puede devolver solo el user (sin token)
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
  };
}

// LOGIN DE USUARIO (signIn)
export async function signIn(email: string, password: string): Promise<{ user: User; token: string }> {
  const response = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Credenciales inválidas");
  }
  const data = await response.json();
  // Guarda el token JWT para próximas requests
  localStorage.setItem("token", data.token);
  return {
    user: data.user,
    token: data.token,
  };
}

// FUNCIÓN PARA OBTENER EL TOKEN GUARDADO
export function getToken(): string | null {
  return localStorage.getItem("token");
}

// LOGOUT
export function logout() {
  localStorage.removeItem("token");
}
