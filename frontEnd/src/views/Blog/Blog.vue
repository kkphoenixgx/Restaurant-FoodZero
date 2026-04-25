
<template>
  
  <div class="blog">
    <HeaderPush />

    <div class="blog-page">
      <div class="blog-page-section">
        <h1>Blog</h1>
        <p>Confira nossas novidades, receitas e dicas no blog do FoodZero.</p>

        <div v-if="loggedUser" style="margin-bottom:2rem;text-align:center;">
          <button @click="showAddForm = !showAddForm" class="blog-action-btn">
            {{ showAddForm ? 'Cancelar' : 'Novo Post' }}
          </button>
          
          <div v-if="showAddForm" class="add-post-form">
            <textarea v-model="newPostDesc" placeholder="No que você está pensando?" rows="4" style="width:100%;padding:0.8rem;border-radius:0.5rem;margin-bottom:1rem;resize:vertical;"></textarea>
            
            <div class="tags-selection" style="margin-bottom: 1.2rem; text-align: left;">
              <span style="display:block;margin-bottom:0.5rem;font-weight:600;color:#333;">Criar ou Selecionar Tags:</span>
              <div style="display:flex;gap:0.5rem;margin-bottom:0.8rem;">
                <input type="text" v-model="newTagName" placeholder="Nova tag (ex: Receitas)" @keydown.enter.prevent="handleAddNewTag" style="padding:0.5rem;border-radius:0.4rem;border:1px solid #e0cfc2;flex:1;" />
                <button type="button" @click.prevent="handleAddNewTag" :disabled="isAddingTag" style="padding:0.5rem 1rem;background:#5e6600;color:#fff;border:none;border-radius:0.4rem;cursor:pointer;font-weight:600;">
                  {{ isAddingTag ? 'Adicionando...' : 'Criar Tag' }}
                </button>
              </div>
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                <label v-for="tag in availableTags" :key="tag.id" class="tag-checkbox">
                  <input type="checkbox" :value="tag.id" v-model="selectedTags" />
                  {{ tag.name }}
                </label>
              </div>
            </div>

            <button @click="handleAddPost" :disabled="isSubmitting" class="blog-action-btn submit-btn">
              {{ isSubmitting ? 'Salvando...' : 'Publicar' }}
            </button>
            <span v-if="addError" style="color:#b85c38;display:block;margin-top:0.5rem;">{{ addError }}</span>
          </div>
        </div>

        <div v-if="loading && posts.length === 0" class="blog-loading">Carregando posts...</div>
        <div v-else-if="error" class="blog-error">{{ error }}</div>
        <div v-else>
          <div v-if="posts.length === 0" class="blog-empty">Nenhum post encontrado.</div>
          <div v-else class="blog-list-social">
            <div v-for="post in posts" :key="post.id" class="social-post-card">
              
              <!-- Cabeçalho (Autor e Ações) -->
              <div class="social-post-header">
                <div class="user-info" @click="goToPost(post.id)">
                  <img :src="getImageUrl(post.user?.userImagePath) || defaultUser" alt="Avatar" class="avatar" />
                  <div>
                    <strong>{{ post.user?.name || 'Desconhecido' }}</strong>
                    <span class="post-date">{{ new Date(post.date).toLocaleString() }}</span>
                  </div>
                </div>
                <div v-if="canModifyPost(post)" class="post-actions">
                  <button @click="startEditPost(post)" class="btn-edit">Editar</button>
                  <button @click="handleDeletePost(post.id)" class="btn-delete">Excluir</button>
                </div>
              </div>

              <!-- Corpo (Descrição e Tags) -->
              <div class="social-post-body">
                <div v-if="editingPostId === post.id" class="edit-post-form">
                  <textarea v-model="editPostDesc" rows="4"></textarea>
                  <div class="edit-actions">
                    <button @click="saveEditPost(post)" class="btn-save">Salvar</button>
                    <button @click="editingPostId = null" class="btn-cancel">Cancelar</button>
                  </div>
                </div>
                <p v-else class="post-desc" @click="goToPost(post.id)">{{ post.description }}</p>
                <div class="post-tags" v-if="post.tags?.length">
                  <span v-for="tag in post.tags" :key="tag.id" class="tag">#{{ tag.name }}</span>
                </div>
              </div>

              <!-- Rodapé (Comentários inline) -->
              <div class="social-post-footer">
                <div class="comments-section">
                  <p class="comments-count">{{ post.comentaries?.length || 0 }} comentários</p>
                  <div class="comment-list">
                    <div v-for="c in post.comentaries" :key="c.id" class="comment-item">
                      <div class="comment-bubble">
                        <strong>{{ userCache[c.user_id]?.name || 'Anônimo' }}</strong>
                        <span>{{ c.description }}</span>
                      </div>
                      <button v-if="canModifyComment(c)" @click="handleDeleteComment(post, c.id)" class="btn-delete-comment">X</button>
                    </div>
                  </div>
                  <div class="add-comment" v-if="loggedUser">
                    <img :src="getImageUrl(loggedUser.userImagePath || loggedUser._userImagePath) || defaultUser" alt="Avatar" class="avatar-small" />
                    <input type="text" v-model="newComments[post.id]" placeholder="Escreva um comentário..." @keyup.enter="handleAddComment(post)" />
                    <button @click="handleAddComment(post)" class="btn-send">Enviar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="loading && posts.length > 0" class="blog-loading" style="margin-top: 2rem;">Carregando mais posts...</div>
          <div v-if="!hasMore && posts.length > 0" style="text-align: center; color: #888; margin-top: 2rem; padding-bottom: 2rem;">Você chegou ao fim!</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { listPosts, createPost, deletePost, updatePost } from '../../services/post';
import { listTags, createTag } from '../../services/tags';
import { getComentariesFromAPost, postComentary, deleteComentary } from '../../services/comentaries';
import { getUser } from '../../services/user';
import type Post from '../../types/Model/Post';
import type Tag from '../../types/Model/Tag';
import type Comentary from '../../types/Model/Comentary';
import HeaderPush from '../../components/ui/HeaderPush.vue';

import defaultUser from '../../assets/images/user-default.png';

const posts = ref<Post[]>([]);
const loading = ref(true);
const error = ref('');
const router = useRouter();

const loggedUser = ref<any>(null);
const showAddForm = ref(false);
const newPostDesc = ref('');
const addError = ref('');
const isSubmitting = ref(false);
const availableTags = ref<Tag[]>([]);
const selectedTags = ref<number[]>([]);
const newTagName = ref('');
const isAddingTag = ref(false);

const userCache = ref<Record<number, any>>({});
const newComments = ref<Record<number, string>>({});
const editingPostId = ref<number | null>(null);
const editPostDesc = ref('');

const defaultServer = import.meta.env.VITE_API_SERVER || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'https://backendrestaurantfoodzero-production.up.railway.app');

function getImageUrl(path: string | null | undefined) {
  if (!path || path === 'null' || path === 'undefined') return '';
  if (path.startsWith('http') || path.startsWith('data:image')) return path;
  const baseUrl = defaultServer.endsWith('/') ? defaultServer.slice(0, -1) : defaultServer;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
}

async function loadUser(userId: number) {
  if (!userCache.value[userId]) {
    try { userCache.value[userId] = await getUser(userId); } 
    catch { userCache.value[userId] = { name: 'Anônimo' }; }
  }
}

async function loadCommentsForPosts(postsToLoad: Post[]) {
  for (const p of postsToLoad) {
    try {
      p.comentaries = await getComentariesFromAPost(p.id) || [];
      for (const c of p.comentaries) await loadUser(c.user_id);
    } catch(e) { p.comentaries = []; }
  }
}

// Paginação Infinite Scroll
const currentPage = ref(1);
const itemsPerPage = 6;
const hasMore = ref(true);

onMounted(async () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      loggedUser.value = JSON.parse(userStr);
    }
    availableTags.value = await listTags();
    posts.value = await listPosts(currentPage.value, itemsPerPage);
    await loadCommentsForPosts(posts.value);
    if (posts.value.length < itemsPerPage) hasMore.value = false;
    window.addEventListener('scroll', handleScroll);
  } catch (e) {
    error.value = 'Erro ao carregar dados.';
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

async function handleScroll() {
  if (loading.value || !hasMore.value) return;
  
  const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight - 100;
  if (bottomOfWindow) {
    loading.value = true;
    currentPage.value++;
    try {
      const newPosts = await listPosts(currentPage.value, itemsPerPage);
      await loadCommentsForPosts(newPosts);
      if (newPosts.length < itemsPerPage) hasMore.value = false;
      posts.value.push(...newPosts);
    } catch (e) {
      console.error('Erro ao buscar mais posts:', e);
    } finally {
      loading.value = false;
    }
  }
}

async function handleAddNewTag() {
  const name = newTagName.value.trim();
  if (!name) return;

  // Verifica se a tag já existe para evitar erros
  const existing = availableTags.value.find(t => t.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    if (!selectedTags.value.includes(existing.id)) {
      selectedTags.value.push(existing.id);
    }
    newTagName.value = '';
    return;
  }

  isAddingTag.value = true;
  try {
    const created = await createTag({ name });
    availableTags.value.push(created);
    selectedTags.value.push(created.id); // Seleciona automaticamente
    newTagName.value = '';
  } catch (e: any) {
    addError.value = 'Erro ao criar a tag.';
  } finally {
    isAddingTag.value = false;
  }
}

async function handleAddPost() {
  addError.value = '';
  if (!newPostDesc.value.trim()) {
    addError.value = 'A descrição não pode ser vazia.';
    return;
  }
  isSubmitting.value = true;
  try {
    const userId = loggedUser.value._id || loggedUser.value.id;
    await createPost({
      description: newPostDesc.value.trim(),
      date: new Date().toISOString(),
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '), // Formato compatível com DATETIME do MySQL
      user: userId,
      userId: userId,
      user_id: userId,
      tags: selectedTags.value.map(id => {
        const tagObj = availableTags.value.find(t => t.id === id);
        return { id, name: tagObj?.name || '' };
      })
    });
    currentPage.value = 1;
    hasMore.value = true;
    posts.value = await listPosts(currentPage.value, itemsPerPage);
    await loadCommentsForPosts(posts.value);
    if (posts.value.length < itemsPerPage) hasMore.value = false;
    showAddForm.value = false;
    newPostDesc.value = '';
    selectedTags.value = [];
  } catch (e: any) {
    let msg = e.message || 'Erro ao criar post.';
    // Tenta extrair a mensagem de erro real enviada pelo backend
    try {
      const errObj = JSON.parse(msg);
      msg = errObj.error || errObj.message || msg;
    } catch {}
    
    addError.value = msg;
  } finally {
    isSubmitting.value = false;
  }
}

function canModifyPost(post: Post) {
  if (!loggedUser.value) return false;
  const uId = loggedUser.value._id || loggedUser.value.id;
  const pId = post.user?.id || (post.user as any)?._id;
  const role = loggedUser.value.role || loggedUser.value._role;
  return uId === pId || role === 'admin';
}

function canModifyComment(c: Comentary) {
  if (!loggedUser.value) return false;
  const uId = loggedUser.value._id || loggedUser.value.id;
  const role = loggedUser.value.role || loggedUser.value._role;
  return uId === c.user_id || role === 'admin';
}

function startEditPost(post: Post) {
  editingPostId.value = post.id;
  editPostDesc.value = post.description;
}

async function saveEditPost(post: Post) {
  if(!editPostDesc.value.trim()) return;
  try {
    await updatePost(post.id, {
       description: editPostDesc.value.trim(),
       date: post.date.toISOString(),
       user: post.user.id, userId: post.user.id,
       tags: post.tags.map((t: Tag) => ({ id: t.id, name: t.name }))
    });
    post.description = editPostDesc.value.trim();
    editingPostId.value = null;
  } catch (e) { alert('Erro ao editar post'); }
}

async function handleAddComment(post: Post) {
  const text = (newComments.value[post.id] || '').trim();
  if (!text) return;
  try {
    const uId = loggedUser.value._id || loggedUser.value.id;
    await postComentary({ description: text, postId: post.id, userId: uId, date: new Date().toISOString() });
    newComments.value[post.id] = '';
    post.comentaries = await getComentariesFromAPost(post.id) || [];
    for (const c of post.comentaries) await loadUser(c.user_id);
  } catch(e) { alert('Erro ao adicionar comentário'); }
}

async function handleDeleteComment(post: Post, commentId: number) {
  if(!confirm('Deletar este comentário?')) return;
  try {
    await deleteComentary(commentId);
    post.comentaries = post.comentaries.filter((c: any) => c.id !== commentId);
  } catch(e) { alert('Erro ao deletar comentário'); }
}

function goToPost(id: number) {
  router.push({ name: 'BlogPost', params: { id } });
}

async function handleDeletePost(id: number) {
  if (!confirm('Tem certeza que deseja deletar este post?')) return;
  try {
    await deletePost(id);
    posts.value = posts.value.filter(p => p.id !== id);
  } catch (e) {
    alert('Erro ao deletar post.');
  }
}

</script>

<style scoped>
  .blog-page-section {
    max-width: 900px;
    margin: 0 auto;
    padding: 3rem 1rem;
    color: #222;
    min-height: 60vh;
  }
  .blog-page-section h1 {
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
    color: #b85c38;
  }
  .blog-page-section p {
    font-size: 1.1rem;
    margin-bottom: 1.2rem;
    line-height: 1.7;
  }
  .blog-action-btn {
    background: #b85c38;
    color: #fff;
    padding: 0.6rem 1.2rem;
    border-radius: 0.5rem;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  .blog-action-btn:hover:not(:disabled) {
    background: #a14d2c;
  }
  .blog-action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .add-post-form {
    margin-top: 1.5rem;
    background: #fff8f0;
    padding: 1.5rem;
    border-radius: 1rem;
    text-align: left;
  }
  .blog-loading, .blog-error, .blog-empty {
    text-align: center;
    font-size: 1.1rem;
    margin: 2rem 0;
    color: #b85c38;
  }
  
  .blog-list-social {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    width: 100%;
  }
  .social-post-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    width: 100%;
    max-width: 650px;
    padding: 1.5rem;
    box-sizing: border-box;
  }
  .social-post-header {
    display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;
  }
  .user-info {
    display: flex; align-items: center; gap: 0.8rem; cursor: pointer;
  }
  .avatar {
    width: 48px; height: 48px; border-radius: 50%; object-fit: cover;
  }
  .user-info strong {
    display: block; color: #333; font-size: 1.1rem;
  }
  .post-date {
    color: #777; font-size: 0.9rem;
  }
  .post-actions button {
    margin-left: 0.5rem; padding: 0.3rem 0.6rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;
  }
  .btn-edit { background: #e0cfc2; color: #333; }
  .btn-delete { background: #b85c38; color: #fff; }
  .social-post-body {
    margin-bottom: 1.5rem;
  }
  .post-desc {
    font-size: 1.1rem; line-height: 1.6; color: #222; white-space: pre-wrap; cursor: pointer;
  }
  .post-tags {
    margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;
  }
  .post-tags .tag {
    color: #b85c38; background: #f3e1d7; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.9rem; font-weight: bold;
  }
  .social-post-footer {
    border-top: 1px solid #f0f2f5; padding-top: 1rem;
  }
  .comments-count {
    color: #555; font-size: 0.95rem; margin-bottom: 1rem;
  }
  .comment-item {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.8rem;
  }
  .comment-bubble {
    background: #f0f2f5; padding: 0.6rem 1rem; border-radius: 18px; display: inline-block; max-width: 90%;
  }
  .comment-bubble strong {
    display: block; font-size: 0.9rem; color: #333;
  }
  .btn-delete-comment {
    background: transparent; border: none; color: #999; cursor: pointer; font-size: 1.2rem; font-weight: bold; margin-left: 0.5rem;
  }
  .btn-delete-comment:hover { color: #b85c38; }
  .add-comment {
    display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;
  }
  .avatar-small {
    width: 32px; height: 32px; border-radius: 50%; object-fit: cover;
  }
  .add-comment input {
    flex: 1; padding: 0.6rem 1rem; border-radius: 20px; border: 1px solid #ddd; background: #f0f2f5; outline: none; font-size: 0.95rem;
  }
  .btn-send {
    background: transparent; color: #b85c38; border: none; font-weight: bold; cursor: pointer; font-size: 1rem;
  }
  .edit-post-form textarea {
    width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 0.8rem; font-family: inherit; font-size: 1.05rem; box-sizing: border-box;
  }
  .edit-actions {
    display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.5rem;
  }
  .tag-checkbox {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: #f3e1d7;
    padding: 0.4rem 0.8rem;
    border-radius: 1.5rem;
    font-size: 0.9rem;
    color: #b85c38;
    cursor: pointer;
    transition: background 0.2s;
  }
  .tag-checkbox:hover {
    background: #eacbba;
  }
</style>
