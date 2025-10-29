const API_URL = "http://localhost:3000/api/categorias";

export interface Categoria {
  id?: number;
  descripcion: string;
}

export class CategoriaService {
  async getAllCategorias(): Promise<Categoria[]> {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error en getAllCategorias:", error);
      throw error;
    }
  }

  async getCategoriaById(id: number): Promise<Categoria> {
    try {
      console.log(
        `Intentando obtener categoría con ID ${id} desde ${API_URL}/${id}`
      );
      const response = await fetch(`${API_URL}/${id}`);
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(
          `Error ${response.status}: No se encontró la categoría`
        );
      }

      const result = await response.json();
      console.log("Resultado del servidor:", result);
      return result.data;
    } catch (error) {
      console.error("Error detallado en getCategoriaById:", error);
      throw error;
    }
  }

  async createCategoria(categoria: Categoria): Promise<Categoria> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoria),
    });
    const result = await response.json();
    return result.data;
  }

  async updateCategoria(id: number, categoria: Categoria): Promise<Categoria> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoria),
    });
    const result = await response.json();
    return result.data;
  }

  async deleteCategoria(id: number): Promise<void> {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  }
}

export default new CategoriaService();
