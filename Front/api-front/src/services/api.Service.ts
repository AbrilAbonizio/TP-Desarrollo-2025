const API_URL = 'http://localhost:3000/api'; // tu backend

export async function getUsers(): Promise<unknown> {
  const res = await fetch(`${API_URL}/pasajeros/`);
  console.log('res');
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Error al obtener usuarios: ${res.status} ${res.statusText} ${body}`
    );
  }
  return res.json();
}

export async function createUser(
  data: Record<string, unknown>
): Promise<unknown> {
  const res = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Error al crear usuario: ${res.status} ${res.statusText} ${body}`
    );
  }
  return res.json();
}
