<template>
  <div ref="dropdownWrapper" class="dropdown w-full relative">
    <input
        type="text"
        v-model="query"
        @focus="handleFocus"
        @blur="handleBlur"
        class="w-full rounded-md border border-gray-300 h-full text-xs md:text-sm"
        placeholder="Поиск продукта..."
    />
    <div
        v-if="isOpen && filteredResults.length"
        class="dropdown-content absolute top-full left-0 h-max bg-white w-full z-30 rounded-md"
    >
      <ul>
        <li
            v-for="(result, index) in filteredResults"
            :key="index"
            class="px-3 py-1"
            @mousedown.prevent="selectResult(result)"
        >
        {{ result }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const isOpen = ref(false);
const query = ref('');
const results = ref(['Apple', 'Banana', 'Orange', 'Grape', 'Watermelon', 'Mango']);
const dropdownWrapper = ref(null);

// Filtered results based on query
const filteredResults = computed(() => {
  if (!query.value) return [];
  return results.value.filter(item => item.toLowerCase().includes(query.value.toLowerCase()));
});

const selectResult = (result) => {
  query.value = result;
  isOpen.value = false;
};

// Handle focus and blur with a small delay for better UX
const handleFocus = () => {
  isOpen.value = true;
};

const handleBlur = () => {
  setTimeout(() => {
    isOpen.value = false;
  }, 200); // Small delay to allow click events inside dropdown
};

// Handle clicks outside the dropdown
const handleClickOutside = (event) => {
  if (dropdownWrapper.value && !dropdownWrapper.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>
