const API_URL = "http://localhost:3000/api/solicitudes";

export interface Solicitud {
  pasajero: {
    id: number;
    nombre: string;
    apellido: string;
  };
  viaje: {
    id: number;
    nombre?: string;
    fechaSalida: string;
    fechaLlegada: string;
    ciudad: {
      id: number;
      nombre: string;
    };
  };
  fechaSolicitud: string;
  estado: string;
}

class SolicitudService {
  async getSolicitudesByPasajero(idPasajero: number): Promise<Solicitud[]> {
    try {
      const response = await fetch(`${API_URL}/${idPasajero}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching solicitudes:", error);
      throw error;
    }
  }

  async createSolicitud(solicitud: { idViaje: number; idPasajero: number; fechaSolicitud: string; estado: string }): Promise<Solicitud> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solicitud),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error creating solicitud:", error);
      throw error;
    }
  }
}

export default new SolicitudService();
