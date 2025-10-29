const API_URL = "http://localhost:3000/api/viajes";

export interface Viaje {
  id?: number;
  fechaSalida: string;
  fechaLlegada: string;
  estado: string;
  cupos: number;
  costoEstimado: number;
  descVehiculo: string;
  idOrganizador: number;
  idCiudad: number;
  categorias: number[];
  organizador?: {
    id: number;
    nombre: string;
    apellido: string;
  };
  ciudad?: {
    id: number;
    nombre: string;
    provincia: string;
  };
}

export class ViajeService {
  async getAllViajes(): Promise<Viaje[]> {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error en getAllViajes:", error);
      throw error;
    }
  }

  async getViajeById(id: number): Promise<Viaje> {
    try {
      console.log(
        `Intentando obtener viaje con ID ${id} desde ${API_URL}/${id}`
      );
      const response = await fetch(`${API_URL}/${id}`);
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se encontró el viaje`);
      }

      const result = await response.json();
      console.log("Resultado del servidor:", result);
      return result.data;
    } catch (error) {
      console.error("Error detallado en getViajeById:", error);
      throw error;
    }
  }

  async createViaje(viaje: Viaje): Promise<Viaje> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(viaje),
    });
    const result = await response.json();
    return result.data;
  }

  async updateViaje(id: number, viaje: Viaje): Promise<Viaje> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(viaje),
    });
    const result = await response.json();
    return result.data;
  }

  async deleteViaje(id: number): Promise<void> {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  }

  async getViajesByCategoria(idCategoria: number): Promise<Viaje[]> {
    try {
      const response = await fetch(`${API_URL}/categorias/${idCategoria}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se encontraron viajes`);
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error en getViajesByCategoria:", error);
      throw error;
    }
  }
}

export default new ViajeService();
