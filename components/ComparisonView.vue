<template>
  <div v-if="comparisonFonts.length > 0" class="bg-white rounded-lg shadow-lg border border-gray-200 m-8 max-w-7xl mx-auto">
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Font Comparison</h2>
      <p class="text-gray-600">{{ comparisonFonts.length }} fonts selected for comparison</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <div v-for="font in comparisonFonts" :key="font.name" class="bg-white rounded-lg shadow-md border border-gray-200 p-6" :style="{ fontFamily: font.name }">
        <div class="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">{{ font.name }}</h3>
          <span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">{{ font.tags[0] }}</span>
        </div>
        <div>
          <div class="mb-4 text-lg text-gray-900 leading-relaxed">{{ sampleText }}</div>
          <div class="space-y-3">
            <button class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Sample Button</button>
            <input class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="Input field" />
            <div class="text-xl font-bold text-gray-900">Heading Text</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['comparisonFonts', 'sampleText'])
</script>