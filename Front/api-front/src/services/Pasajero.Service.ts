const API_URL = "http://localhost:3000/api/pasajeros";

export interface Pasajero {
  id?: number;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  email: string;
}

interface ApiError extends Error {
  response?: Response;
}

export class PasajeroService {
  async getAllPasajeros(): Promise<Pasajero[]> {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error en getAllPasajeros:", error);
      throw error;
    }
  }

  async getPasajeroById(id: number): Promise<Pasajero> {
    try {
      console.log(
        `Intentando obtener pasajero con ID ${id} desde ${API_URL}/${id}`
      );
      const response = await fetch(`${API_URL}/${id}`);
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se encontró el pasajero`);
      }

      const result = await response.json();
      console.log("Resultado del servidor:", result);
      return result.data;
    } catch (error) {
      console.error("Error detallado en getPasajeroById:", error);
      throw error;
    }
  }

  async createPasajero(pasajero: Pasajero): Promise<Pasajero> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pasajero),
    });
    const result = await response.json();
    return result.data;
  }

  async updatePasajero(id: number, pasajero: Pasajero): Promise<Pasajero> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pasajero),
    });
    const result = await response.json();
    return result.data;
  }

  async deletePasajero(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const error = new Error(data.message || `Error ${response.status}`) as ApiError;
      error.response = response;
      throw error;
    }
  }
}

export default new PasajeroService();
