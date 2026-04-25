<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { listPlates, createPlate, getPlatesByCategory, updatePlate, deletePlate, getCategoriesByPlate } from '../../services/plates';
import { listCategories } from '../../services/categories';
import type Plate from '../../types/Model/Plate';
import type Category from '../../types/Model/Category';
import HeaderPush from '../../components/ui/HeaderPush.vue';

const route = useRoute();
const defaultServer = import.meta.env.VITE_API_SERVER || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'https://backendrestaurantfoodzero-production.up.railway.app');

const plates = ref<Plate[]>([]);
const categories = ref<Category[]>([]);
const loading = ref(true);
const error = ref('');

const searchQuery = ref('');
const filteredPlates = computed(() => {
  if (!searchQuery.value.trim()) return plates.value;
  const q = searchQuery.value.trim().toLowerCase();
  return plates.value.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q)
  );
});

// Controle de admin
const isAdmin = ref(false);
const showAddForm = ref(false);
const newPlate = ref({
  name: '',
  value: '',
  description: '',
  categoryId: ''
});
const addError = ref('');
const plateImageFile = ref<File | null>(null);
const currentCategory = ref<number | ''>('');

const editingPlateId = ref<number | null>(null);
const editPlateData = ref({ name: '', value: '', description: '', categoryId: '' as string | number });
const editPlateImageFile = ref<File | null>(null);

async function fetchPlates(catId: number | '') {
  loading.value = true;
  currentCategory.value = catId;
  try {
    if (catId === '') {
      plates.value = await listPlates();
    } else {
      plates.value = await getPlatesByCategory(catId);
    }
  } catch (e) {
    error.value = 'Erro ao carregar pratos filtrados.';
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  try {
    categories.value = await listCategories();
    
    const catQuery = route.query.category;
    if (catQuery) {
      const found = categories.value.find(c => c.name.toLowerCase() === String(catQuery).toLowerCase());
      if (found) {
        await fetchPlates(found.id);
      } else {
        await fetchPlates('');
      }
    } else {
      await fetchPlates('');
    }

    // Checa se usuário logado é admin
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        isAdmin.value = user._role === 'admin' || user.role === 'admin';
      } catch {}
    }
  } catch (e) {
    error.value = 'Erro ao carregar pratos.';
    loading.value = false;
  }
});

watch(() => route.query.category, async (newCat) => {
  if (newCat) {
    const found = categories.value.find(c => c.name.toLowerCase() === String(newCat).toLowerCase());
    if (found) {
      await fetchPlates(found.id);
    } else {
      await fetchPlates('');
    }
  } else {
    await fetchPlates('');
  }
});

function onImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null;
  plateImageFile.value = file;
}

function onEditImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null;
  editPlateImageFile.value = file;
}

function getImageUrl(path: string) {
  if (!path || path === 'null' || path === 'undefined') return '';
  if (path.startsWith('http')) return path;
  const baseUrl = defaultServer.endsWith('/') ? defaultServer.slice(0, -1) : defaultServer;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
}

async function handleAddPlate() {
  addError.value = '';

  const nameTrimmed = newPlate.value.name.trim();
  const descTrimmed = newPlate.value.description.trim();
  const rawValue = String(newPlate.value.value).trim();
  const priceValue = Number(rawValue);

  if (!nameTrimmed || !rawValue || !descTrimmed) {
    addError.value = 'Preencha todos os campos.';
    return;
  }
  if (nameTrimmed.length < 3) {
    addError.value = 'O nome do prato deve ter pelo menos 3 caracteres.';
    return;
  }
  if (isNaN(priceValue) || priceValue <= 0) {
    addError.value = 'O valor do prato deve ser um número maior que zero.';
    return;
  }
  try {
    const formData = new FormData();
    formData.append('name', nameTrimmed);
    formData.append('value', priceValue.toString());
    formData.append('description', descTrimmed);
    if (plateImageFile.value) {
      formData.append('foto', plateImageFile.value);
    }
    if (newPlate.value.categoryId) {
      formData.append('categoryId', newPlate.value.categoryId);
    }

    await createPlate(formData);
    await fetchPlates(currentCategory.value); // Atualiza a lista inteira
    showAddForm.value = false;
    newPlate.value = { name: '', value: '', description: '', categoryId: '' };
    plateImageFile.value = null;
  } catch (e) {
    addError.value = 'Erro ao adicionar prato.';
  }
}

async function startEditPlate(plate: Plate) {
  editingPlateId.value = plate.id;
  editPlateData.value = {
    name: plate.name,
    value: String(plate.value),
    description: plate.description,
    categoryId: ''
  };
  editPlateImageFile.value = null;

  try {
    const cats = await getCategoriesByPlate(plate.id);
    if (cats && cats.length > 0) {
      const cat = cats[0] as any;
      editPlateData.value.categoryId = cat.id !== undefined ? cat.id : cat;
    }
  } catch (e) {
    console.error('Erro ao buscar categorias do prato', e);
  }
}

async function handleUpdatePlate(id: number) {
  const nameTrimmed = editPlateData.value.name.trim();
  const descTrimmed = editPlateData.value.description.trim();
  const priceValue = Number(editPlateData.value.value);

  if (!nameTrimmed || !descTrimmed || isNaN(priceValue) || priceValue <= 0) return;

  try {
    const formData = new FormData();
    formData.append('name', nameTrimmed);
    formData.append('value', priceValue.toString());
    formData.append('description', descTrimmed);
    if (editPlateImageFile.value) formData.append('foto', editPlateImageFile.value);
    if (editPlateData.value.categoryId) {
      formData.append('categoryId', String(editPlateData.value.categoryId));
    } else {
      formData.append('categoryId', ''); // Avisa o backend para remover a categoria
    }
    
    await updatePlate(id, formData);
    await fetchPlates(currentCategory.value);
    editingPlateId.value = null;
  } catch (e: any) {
    alert(e.message || 'Erro ao atualizar prato.');
  }
}

async function handleDeletePlate(id: number) {
  if (!confirm('Tem certeza que deseja excluir este prato?')) return;
  await deletePlate(id);
  await fetchPlates(currentCategory.value);
}
</script>

<template>
  <div class="menu-section">
    <HeaderPush />
    <div class="menu-page">
      <h1>Cardápio</h1>
      <p class="menu-description">Confira todos os pratos disponíveis no FoodZero.</p>
      
      <div class="category-filters" style="margin-bottom:2rem;display:flex;gap:0.8rem;flex-wrap:wrap;justify-content:center;">
        <button :class="{ 'active-cat': currentCategory === '' }" @click="fetchPlates('')" class="cat-btn">Todos</button>
        <button v-for="cat in categories" :key="cat.id" :class="{ 'active-cat': currentCategory === cat.id }" @click="fetchPlates(cat.id)" class="cat-btn">
          {{ cat.name }}
        </button>
      </div>

      <div class="search-bar" style="margin-bottom:2rem;text-align:center;">
        <input v-model="searchQuery" type="text" placeholder="Buscar pratos pelo nome ou descrição..." class="menu-search-input" />
      </div>

      <div v-if="loading" class="menu-loading">Carregando pratos...</div>
      <div v-else-if="error" class="menu-error">{{ error }}</div>
      <div v-else>
      <div v-if="isAdmin" style="margin-bottom:2rem;">
        <button @click="showAddForm = !showAddForm" style="background:#b85c38;color:#fff;padding:0.6rem 1.2rem;border:none;border-radius:0.4rem;cursor:pointer;">
          {{ showAddForm ? 'Cancelar' : 'Adicionar Prato' }}
        </button>
        <div v-if="showAddForm" class="add-plate-form" style="margin-top:1.2rem;background:#fff8f3;padding:1.2rem 1rem;border-radius:0.6rem;max-width:400px;">
          <div style="margin-bottom:0.7rem;">
            <input v-model="newPlate.name" placeholder="Nome do prato" style="width:100%;padding:0.5rem;margin-bottom:0.5rem;" />
            <input v-model="newPlate.value" type="number" placeholder="Valor (Ex: 25.50)" min="0.01" step="0.01" style="width:100%;padding:0.5rem;margin-bottom:0.5rem;" />
            <select v-model="newPlate.categoryId" style="width:100%;padding:0.5rem;margin-bottom:0.5rem;">
              <option value="">Sem categoria</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <input type="file" accept="image/*" @change="onImageChange" style="width:100%;padding:0.5rem;margin-bottom:0.5rem;" />
            <textarea v-model="newPlate.description" placeholder="Descrição" style="width:100%;padding:0.5rem;resize:vertical;"></textarea>
          </div>
          <button @click="handleAddPlate" style="background:#2e7d32;color:#fff;padding:0.5rem 1.2rem;border:none;border-radius:0.4rem;cursor:pointer;">Salvar</button>
          <span v-if="addError" style="color:#b85c38;display:block;margin-top:0.5rem;">{{ addError }}</span>
        </div>
      </div>
      <div v-if="filteredPlates.length === 0" class="menu-empty">Nenhum prato encontrado.</div>
      <div v-else class="plates-list">
        <div v-for="plate in filteredPlates" :key="plate.id" class="plate-item">
          <img v-if="plate.imagePath" :src="getImageUrl(plate.imagePath)" :alt="plate.name" class="plate-image" />
          <div class="plate-info">
            <h2 class="plate-name">{{ plate.name }}</h2>
            <span class="plate-value">R$ {{ Number(plate.value || 0).toFixed(2) }}</span>
            <p class="plate-description">{{ plate.description }}</p>
          </div>

          <!-- Edição Inline -->
          <div v-if="editingPlateId === plate.id" class="edit-plate-inline">
            <input v-model="editPlateData.name" placeholder="Nome do prato" />
            <input v-model="editPlateData.value" type="number" step="0.01" placeholder="Valor" />
            <select v-model="editPlateData.categoryId">
              <option value="">Sem categoria</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <input type="file" accept="image/*" @change="onEditImageChange" />
            <textarea v-model="editPlateData.description" placeholder="Descrição"></textarea>
            <div class="plate-admin-actions">
              <button @click="handleUpdatePlate(plate.id)" class="btn-save">Salvar</button>
              <button @click="editingPlateId = null" class="btn-cancel">Cancelar</button>
            </div>
          </div>

          <div v-if="isAdmin && editingPlateId !== plate.id" class="plate-admin-actions">
            <button @click="startEditPlate(plate)" class="btn-edit">Editar</button>
            <button @click="handleDeletePlate(plate.id)" class="btn-delete">Excluir</button>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1rem;
  color: #222;
}
.menu-page h1 {
  font-size: 2.4rem;
  margin-bottom: 0.5rem;
  color: #b85c38;
  font-family: 'Rufina', serif;
}
.menu-description {
  font-size: 1.15rem;
  margin-bottom: 2rem;
  color: #555;
}
.menu-loading, .menu-error, .menu-empty {
  text-align: center;
  font-size: 1.1rem;
  margin: 2rem 0;
  color: #b85c38;
}
.plates-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}
.plate-item {
  background: #fff8f0;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1.5rem 1rem;
  width: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.2s;
}
.plate-item:hover {
  box-shadow: 0 4px 16px rgba(184,92,56,0.10);
}
.plate-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.7rem;
  margin-bottom: 1rem;
  background: #fff;
}
.plate-info {
  text-align: center;
}
.plate-name {
  font-size: 1.3rem;
  color: #b85c38;
  margin-bottom: 0.3rem;
}
.plate-value {
  font-weight: bold;
  color: #2e7d32;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  display: block;
}
.plate-description {
  font-size: 1rem;
  color: #444;
  margin-top: 0.3rem;
}
.cat-btn {
  background: #f9f6f2;
  border: 1.5px solid #e0cfc2;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  cursor: pointer;
  font-weight: 500;
  color: #555;
  transition: all 0.2s;
}
.active-cat {
  background: #b85c38;
  color: #fff;
  border-color: #b85c38;
}
.edit-plate-inline {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}
.edit-plate-inline input, .edit-plate-inline textarea, .edit-plate-inline select {
  width: 100%; padding: 0.5rem; border: 1px solid #e0cfc2; border-radius: 4px; box-sizing: border-box;
}
.plate-admin-actions {
  display: flex; gap: 0.5rem; margin-top: 1rem; width: 100%; justify-content: center;
}
.plate-admin-actions button {
  padding: 0.4rem 0.8rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%;
}
.btn-edit { background: #e0cfc2; color: #333; }
.btn-delete { background: #b85c38; color: #fff; }
.btn-save { background: #2e7d32; color: #fff; }
.btn-cancel { background: #ccc; color: #333; }

.menu-search-input {
  padding: 0.6rem 1.2rem;
  width: 100%;
  max-width: 400px;
  border-radius: 2rem;
  border: 1px solid #e0cfc2;
  outline: none;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  transition: border 0.2s, box-shadow 0.2s;
}
.menu-search-input:focus {
  border-color: #b85c38;
  box-shadow: 0 0 0 3px rgba(184, 92, 56, 0.1);
}

@media (max-width: 700px) {
  .plates-list {
    gap: 1rem;
  }
  .plate-item {
    width: 100%;
    padding: 1rem 0.5rem;
  }
}
</style>
