const API_URL = "http://localhost:3000/api/ciudades";

export interface Ciudad {
  id?: number;
  nombre: string;
  provincia: string;
  latitud: number;
  longitud: number;
}

export class CiudadService {
  async getAllCiudades(): Promise<Ciudad[]> {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error en getAllCiudades:", error);
      throw error;
    }
  }

  async getCiudadById(id: number): Promise<Ciudad> {
    try {
      console.log(`Intentando obtener ciudad con ID ${id} desde ${API_URL}/${id}`);
      const response = await fetch(`${API_URL}/${id}`);
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se encontró la ciudad`);
      }

      const result = await response.json();
      console.log("Resultado del servidor:", result);
      return result.data;
    } catch (error) {
      console.error("Error detallado en getCiudadById:", error);
      throw error;
    }
  }

  async createCiudad(ciudad: Ciudad): Promise<Ciudad> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ciudad),
    });
    const result = await response.json();
    return result.data;
  }

  async updateCiudad(id: number, ciudad: Ciudad): Promise<Ciudad> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ciudad),
    });
    const result = await response.json();
    return result.data;
  }

  async deleteCiudad(id: number): Promise<void> {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  }
}

export default new CiudadService();
