export interface Solicitud {
    id?: number;
    idViaje: number;
    idPasajero: number;
    fechaSolicitud: string;
    estado: "pendiente" | "aceptada" | "rechazada";
}