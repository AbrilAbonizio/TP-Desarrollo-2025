const API_URL = 'http://localhost:3000/api/pasajeros';

export async function getAllPasajeros() {
  try {
    const res = await fetch(API_URL);

    // Si la respuesta del backend no es OK (2xx)
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText || res.statusText}`);
    }

    // Si todo sale bien, devolvés el JSON
    return await res.json();
  } catch (error) {
    console.error('Error al obtener los pasajeros:', error);
    // Podés lanzar el error para que el componente lo maneje
    throw error;
  }
}
